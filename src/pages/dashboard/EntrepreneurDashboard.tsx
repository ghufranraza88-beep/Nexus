import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { MeetingRequestCard } from '../../components/collaboration/MeetingRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { AvailabilitySlot, CollaborationRequest, MeetingRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { getSlotsForEntrepreneur, getMeetingRequestsForEntrepreneur, updateMeetingRequestStatus } from '../../data/meetings';
import { investors } from '../../data/users';
import { MeetingCalendar } from '../../components/calendar/MeetingCalendar';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [recommendedInvestors, setRecommendedInvestors] = useState(investors.slice(0, 3));
  
  useEffect(() => {
    if (user) {
      // Load collaboration and meeting requests + availability for the entrepreneur
      const collaboration = getRequestsForEntrepreneur(user.id);
      const meetings = getMeetingRequestsForEntrepreneur(user.id);
      const slots = getSlotsForEntrepreneur(user.id);

      setCollaborationRequests(collaboration);
      setMeetingRequests(meetings);
      setAvailabilitySlots(slots);
    }
  }, [user]);
  
  const handleCollaborationStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  const handleMeetingStatusUpdate = (requestId: string, status: 'accepted' | 'declined') => {
    const updated = updateMeetingRequestStatus(requestId, status);
    if (!updated) return;

    setMeetingRequests(prev => prev.map(req => req.id === requestId ? updated : req));
  };
  
  if (!user) return null;
  
  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  const confirmedMeetings = meetingRequests.filter(req => req.status === 'accepted');
  const pendingMeetingRequests = meetingRequests.filter(req => req.status === 'pending');
  const upcomingMeetingsCount = confirmedMeetings.length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        
        <Link to="/investors">
          <Button
            leftIcon={<PlusCircle size={18} />}
          >
            Find Investors
          </Button>
        </Link>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">{upcomingMeetingsCount}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Profile Views</p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Meeting Calendar</h2>
          </CardHeader>
          <CardBody>
            <MeetingCalendar
              entrepreneurId={user.id}
              slots={availabilitySlots}
              onSlotsChange={setAvailabilitySlots}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Confirmed Meetings</h2>
          </CardHeader>
          <CardBody>
            {confirmedMeetings.length > 0 ? (
              <ul className="space-y-2">
                {confirmedMeetings.map(meeting => {
                  const investor = investors.find(inv => inv.id === meeting.investorId);
                  const slot = availabilitySlots.find(s => s.id === meeting.slotId);
                  return (
                    <li key={meeting.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span>📅 {investor?.name || 'Investor'} — {slot ? `${slot.date} at ${slot.time}` : 'Scheduled time'}</span>
                      <span className="text-sm text-gray-500">Confirmed</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No confirmed meetings yet. Accept a meeting request to populate this list.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Meeting Requests</h2>
          <Badge variant="accent">{pendingMeetingRequests.length} pending</Badge>
        </CardHeader>
        <CardBody>
          {meetingRequests.length > 0 ? (
            <div className="space-y-4">
              {meetingRequests.map(request => (
                <MeetingRequestCard
                  key={request.id}
                  request={request}
                  onStatusUpdate={handleMeetingStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <AlertCircle size={24} className="text-gray-500" />
              </div>
              <p className="text-gray-600">No meeting requests yet</p>
              <p className="text-sm text-gray-500 mt-1">Investors can request meetings from your available time slots.</p>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
        
        {/* Recommended investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            
            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};