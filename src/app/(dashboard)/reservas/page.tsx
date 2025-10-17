"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, List, Search, Filter, Eye, Edit, Trash2, Clock, User, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { createClient } from '@/clients/supabaseClient';
import { useUser } from '@/context/UserContext';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

interface Lead {
  id: number;
  user_id: string;
  name: string;
  contact_whatsapp: string;
  email: string;
  status: string;
  created_at: string;
  current_booking_state?: string;
}

interface Booking {
  id: number;
  user_id: string;
  lead_id: number;
  room_type_id: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'pendente' | 'confirmada' | 'cancelada' | 'concluida' | 'expired';
  created_at: string;
  payment_intent_id?: string;
  google_calendar_event_id?: string;
  // Campos que precisaremos buscar separadamente ou via JOIN
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  room_type?: string;
  adults?: number;
  children?: number;
  notes?: string;
  lead?: Lead;
}

type ViewMode = 'list' | 'calendar';
type StatusFilter = 'all' | 'pendente' | 'confirmada' | 'cancelada' | 'concluida' | 'expired';

// Configurar o localizer para português brasileiro
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

export default function ReservasPage() {
  const { userData } = useUser();
  const supabase = createClient();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (!userData?.profile?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/getbookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'x-api-key': process.env.NEXT_PUBLIC_API_SECRET_KEY || '',
          'x-user-id': userData.profile.id,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar reservas');
      }

      const data = await response.json();
      console.log('Data:', data);
      setBookings(data || []);
      console.log('Bookings:', data);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userData?.profile?.id]);

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      booking.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.lead?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.lead?.contact_whatsapp?.includes(searchTerm) ||
      booking.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest_phone?.includes(searchTerm) ||
      booking.room_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  console.log('Filtered bookings:', filteredBookings.length, 'Status filter:', statusFilter, 'Search term:', searchTerm);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'concluida': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    // Usar UTC para evitar problemas de timezone
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.toLocaleDateString('pt-BR');
  };

  // Converter bookings para eventos do calendário
  const convertBookingsToEvents = (bookings: Booking[]) => {
    console.log('Bookings:', bookings);
    console.log('Converting bookings to events:', bookings.length);
    return bookings.map(booking => {
      // Criar datas em UTC para evitar problemas de timezone
      const startDate = new Date(booking.check_in_date + 'T00:00:00.000Z');
      const endDate = new Date(booking.check_out_date + 'T00:00:00.000Z');
      
      // Adicionar 1 dia à data de checkout porque react-big-calendar trata end como exclusiva
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setUTCDate(endDatePlusOne.getUTCDate() + 1);
      
      console.log(`Booking ${booking.id}: ${booking.check_in_date} -> ${startDate.toISOString()}`);
      console.log(`Booking ${booking.id}: ${booking.check_out_date} -> ${endDate.toISOString()} -> ${endDatePlusOne.toISOString()}`);
      
      return {
        id: booking.id,
        title: `${booking.lead?.name || booking.guest_name || 'Hóspede'} - ${booking.room_type || 'Quarto'}`,
        start: booking.check_in_date,
        end: endDatePlusOne,
        resource: booking,
        status: booking.status,
      };
    });
  };

  // Obter cor do evento baseado no status
  const getEventStyle = (event: any) => {
    const status = event.resource?.status;
    switch (status) {
      case 'confirmada':
        return { style: { backgroundColor: '#10b981', color: 'white' } };
      case 'pendente':
        return { style: { backgroundColor: '#f59e0b', color: 'white' } };
      case 'cancelada':
        return { style: { backgroundColor: '#ef4444', color: 'white' } };
      case 'concluida':
        return { style: { backgroundColor: '#3b82f6', color: 'white' } };
      case 'expired':
        return { style: { backgroundColor: '#6b7280', color: 'white' } };
      default:
        return { style: { backgroundColor: '#6b7280', color: 'white' } };
    }
  };

  // Handle booking actions
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const onNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/updatestatus`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'x-api-key': process.env.NEXT_PUBLIC_API_SECRET_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookingId,
          status: newStatus,
          userId: userData?.profile?.id
        }),
      });

      if (response.ok) {
        await fetchBookings(); // Refresh data
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservas</h1>
          <p className="text-gray-600">Gerencie todas as suas reservas e acomodações</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
                Lista
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Calendário
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 text-black items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 text-black transform -translate-y-1/2 h-4 w-4 " />
                <input
                  type="text"
                  placeholder="Buscar reservas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="concluida">Concluída</option>
                <option value="expired">Expirada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Content */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hóspede
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quarto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.lead?.name || booking.guest_name || 'Hóspede'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.lead?.email || booking.guest_email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.check_in_date} - {booking.check_out_date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.adults || 0} adulto{(booking.adults || 0) > 1 ? 's' : ''}
                          {(booking.children || 0) > 0 && `, ${booking.children} criança${(booking.children || 0) > 1 ? 's' : ''}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.room_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(booking.total_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="text-teal-600 hover:text-teal-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id.toString(), e.target.value)}
                            className="text-xs border border-black rounded px-2 text-black rounded px-2 py-1"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="concluida">Concluída</option>
                            <option value="expired">Expirada</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma reserva encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Suas reservas aparecerão aqui quando forem criadas.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Calendário de Reservas</h3>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 legend-item">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="legend-text text-black">Confirmada</span>
                  </div>
                  <div className="flex items-center gap-2 legend-item">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="legend-text text-black">Pendente</span>
                  </div>
                  <div className="flex items-center gap-2 legend-item">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="legend-text text-black">Cancelada</span>
                  </div>
                  <div className="flex items-center gap-2 legend-item">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="legend-text text-black">Concluída</span>
                  </div>
                  <div className="flex items-center gap-2 legend-item">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span className="legend-text text-black">Expirada</span>
                  </div>
                </div>
              </div>
              
              <div style={{ height: '700px' }} className="calendar-container">
                <BigCalendar
                  localizer={localizer}
                  events={convertBookingsToEvents(filteredBookings)}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  eventPropGetter={getEventStyle}
                  onSelectEvent={(event) => handleViewDetails(event.resource)}
                  views={['month']}
                  defaultView="month"
                  date={currentDate}
                  onNavigate={onNavigate}
                  messages={{
                    next: 'Próximo',
                    previous: 'Anterior',
                    today: 'Hoje',
                    month: 'Mês',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Evento',
                    noEventsInRange: 'Nenhuma reserva neste período.',
                    showMore: (total) => `+${total} mais`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detalhes da Reserva</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Fechar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guest Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-4">Informações do Hóspede</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-black">{selectedBooking.lead?.name || selectedBooking.guest_name || 'Hóspede'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-black">{selectedBooking.lead?.email || selectedBooking.guest_email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-black">{selectedBooking.lead?.contact_whatsapp || selectedBooking.guest_phone || 'N/A'}</span>
                        </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-4">Detalhes da Reserva</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-black">
                          {selectedBooking.check_in_date} - {selectedBooking.check_out_date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-black">{selectedBooking.room_type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-black">
                          {selectedBooking.adults || 0} adulto{(selectedBooking.adults || 0) > 1 ? 's' : ''}
                          {(selectedBooking.children || 0) > 0 && `, ${selectedBooking.children} criança${(selectedBooking.children || 0) > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-teal-600">
                          {formatCurrency(selectedBooking.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-black mb-2">Status</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-black mb-2">Observações</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                    Editar Reserva
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
