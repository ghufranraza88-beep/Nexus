import React from 'react';
import { Check, X, MessageCircle } from 'lucide-react';
import { MeetingRequest } from '../../types';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { findUserById } from '../../data/users';
import { findAvailabilitySlotById, updateMeetingRequestStatus } from '../../data/meetings';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface MeetingRequestCardProps {
  request: MeetingRequest;
  onStatusUpdate?: (requestId: string, status: 'accepted' | 'declined') => void;
}

export const MeetingRequestCard: React.FC<MeetingRequestCardProps> = ({
  request,
  onStatusUpdate
}) => {
  const navigate = useNavigate();
  const investor = findUserById(request.investorId);
  const slot = findAvailabilitySlotById(request.slotId);

  if (!investor) return null;

  const handleAccept = () => {
    updateMeetingRequestStatus(request.id, 'accepted');
    if (onStatusUpdate) {
      onStatusUpdate(request.id, 'accepted');
    }
  };

  const handleDecline = () => {
    updateMeetingRequestStatus(request.id, 'declined');
    if (onStatusUpdate) {
      onStatusUpdate(request.id, 'declined');
    }
  };

  const handleMessage = () => {
    navigate(`/chat/${investor.id}`);
  };

  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'accepted':
        return <Badge variant="success">Confirmed</Badge>;
      case 'declined':
        return <Badge variant="error">Declined</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="transition-all duration-300">
      <CardBody className="flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <Avatar
              src={investor.avatarUrl}
              alt={investor.name}
              size="md"
              status={investor.isOnline ? 'online' : 'offline'}
              className="mr-3"
            />

            <div>
              <h3 className="text-md font-semibold text-gray-900">{investor.name}</h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {getStatusBadge()}
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">{request.message}</p>
          {slot && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900">Requested Time</p>
              <p className="text-sm text-gray-600">{slot.date} at {slot.time} · {slot.durationMinutes} min</p>
            </div>
          )}
        </div>
      </CardBody>

      <CardFooter className="border-t border-gray-100 bg-gray-50">
        {request.status === 'pending' ? (
          <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button
                variant="success"
                size="sm"
                leftIcon={<Check size={16} />}
                onClick={handleAccept}
              >
                Accept
              </Button>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<MessageCircle size={16} />}
              onClick={handleMessage}
            >
              Message
            </Button>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<MessageCircle size={16} />}
              onClick={handleMessage}
            >
              Message
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/profile/investor/${investor.id}`)}
            >
              View Profile
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
