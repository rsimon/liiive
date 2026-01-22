import { useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, Images, LockKeyhole, Shield, Timer, TriangleAlert } from 'lucide-react';
import TimeAgo from 'timeago-react';
import { IIIFImporter, LiiiveLogo } from '../../../components';
import { Skeleton } from '../../../shadcn/skeleton';
import { Table, TableBody, TableCell, TableRow } from '../../../shadcn/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../shadcn/tooltip';
import { getRemainingTime } from '../../../utils/get-remaining-time';
import type { AccessedRoom, MyProfileInformation } from '../../../types';
import { DashboardAccountSettings } from './default-account-settings';
import { MyRoomActions } from './actions/my-room-actions';
import { VisitedRoomActions } from './actions/visited-room-actions';
import { OnboardingDialog, OnboardingMask } from './onboarding';
import { useMyRooms, useOnboarding } from '../_hooks';

export interface DashboardProps <T extends MyProfileInformation> {

  profile?: T;

  settingsComponent?: React.ComponentType<DashboardAccountSettingsProps<T>>;

}

export interface DashboardAccountSettingsProps<T extends MyProfileInformation = MyProfileInformation> {

  className?: string;

  profile: T;

  permanent: number;

}

export const Dashboard = <T extends MyProfileInformation = MyProfileInformation>(props: DashboardProps<T>) => {

  const SettingsComponent = props.settingsComponent || DashboardAccountSettings;

  const { profile } = props;

  const me = profile?.me;

  const { showOnboarding, dismissOnboarding } = useOnboarding();

  const { 
    pendingClaim, 
    claimedRoom,
    loading,
    rooms, 
    changeReadOnly,
    changeTimeLimit, 
    deleteRoom,
    removeVisitedRoom
  } = useMyRooms(me);

  const owned = useMemo(() => me ? rooms.filter(r => r.owner?.id === me.id) : [], [me, rooms]);

  const visited = useMemo(() => me ? rooms.filter(r => r.owner?.id !== me.id) : [], [me, rooms]);

  const permanent = useMemo(() => owned.filter(r => !r.time_limit_hours).length, [owned]);

  const getTime = (room: AccessedRoom) => {
    const { hours, minutes } = getRemainingTime(room);
    return `${hours}h ${minutes}min`;
  }

  const isExpired = (room: AccessedRoom) => {
    if (!room.time_limit_hours) return false;
    const expiresAt = new Date(room.expires_at).getTime();
    return expiresAt <= (new Date()).getTime();
  }

  const enterRoom = useCallback((room: AccessedRoom) => () => window.location.href = `/${room.id}`, []);

  const renderRoomList = (rooms: AccessedRoom[]) => (
    <Table>
      <TableBody>
        {rooms.map(room => (
          <TableRow 
            key={room.id} 
            className="cursor-pointer" 
            tabIndex={0}>
            <TableCell 
              className="pl-3 w-4 whitespace-nowrap"
              onClick={enterRoom(room)}>
              <Tooltip>
                <TooltipTrigger>
                  <a href={`/${room.id}`} tabIndex={-1} className="h-9">
                    {room.is_readonly ? (
                      <LockKeyhole className="size-4 translate-y-0.5" strokeWidth={1.5} />
                    ) : room.iiif_type === 'IMAGE' ? (
                      <Image className="size-4 translate-y-0.5" strokeWidth={1.5} />
                    ) : (
                      <Images className="size-4 translate-y-0.5" strokeWidth={1.5} />
                    )}
                  </a>
                </TooltipTrigger>

                <TooltipContent>
                  IIIF {room.iiif_type === 'IMAGE' ? 'Image' : 'Presentation'} API v{room.major_version}
                </TooltipContent>
              </Tooltip>
            </TableCell>

            <TableCell 
              className="w-full max-w-75 overflow-hidden"
              onClick={enterRoom(room)}>
              <a href={`/${room.id}`} tabIndex={-1} className="truncate block">
                {room.name || room.iiif_content}
              </a>
            </TableCell>

            <TableCell 
              className="w-4 whitespace-nowrap"
              onClick={enterRoom(room)}>
              <a href={`/${room.id}`} tabIndex={-1} className="text-white/60">
                {room.last_accessed && (
                  <span>Visited <TimeAgo datetime={room.last_accessed} /></span>
                )}
              </a>
            </TableCell>

            <TableCell 
              className="w-4 whitespace-nowrap"
              onClick={enterRoom(room)}>
              <a href={`/${room.id}`} tabIndex={-1}>
                <AnimatePresence
                  mode="wait"
                  initial={false}>
                  <motion.div
                    key={room.time_limit_hours}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}>
                    {room.time_limit_hours ? 
                      (isExpired(room) ? (
                        <span className="inline-flex gap-1 tracking-wide font-semibold translate-y-px text-red-400">
                          <TriangleAlert className="size-4" /> Scheduled for Deletion
                        </span>
                      ) : (
                        <span className="inline-flex gap-1 tracking-wide translate-y-px text-amber-400">
                          <Timer className="size-4 -translate-y-px" strokeWidth={1.7} />
                          Expires in 
                          <span>
                            {getTime(room)}
                          </span>
                        </span>
                      )
                    ) : (
                      <span className="inline-flex gap-1 font-semibold text-green-500 tracking-wide translate-y-0.5">
                        <Shield className="size-4 -translate-y-px" /> Permanent Storage
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </a>
            </TableCell>

            <TableCell align="right" className="pr-3 w-4 whitespace-nowrap">
              {room.owner?.id === me?.id ? (
                <MyRoomActions 
                  permanent={permanent}
                  room={room} 
                  quotas={profile?.quotas}
                  onDelete={() => deleteRoom(room)} 
                  onChangeReadOnly={value => changeReadOnly(room, value)}
                  onChangeTimeLimit={value => changeTimeLimit(room, value)}/>
              ) : (
                <VisitedRoomActions 
                  onRemoveFromList={() => removeVisitedRoom(room)} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <TooltipProvider>
      {Boolean(pendingClaim) ? (  
        <OnboardingMask open />
      ) : (
        <OnboardingDialog 
          claimedRoom={claimedRoom}
          open={showOnboarding}
          onOpenChange={() => dismissOnboarding()} />
      )}

      {profile && (
        <SettingsComponent 
          profile={profile} 
          className="absolute cursor-pointer top-6 right-6 border-2 border-white rounded-full shadow-sm" 
          permanent={permanent} />
      )}

      <h1>
        <LiiiveLogo className="text-6xl drop-shadow-md" />
      </h1>
      
      <div className="py-6 pb-20">
        <IIIFImporter
          className="relative flex justify-center shadow-lg max-w-[90%] w-175 mx-auto" />
      </div>

      <div className="w-full max-w-4xl space-y-16 z-10">
        <div>
          <div className="pb-2 pl-0.5">
            <h2 className="text-xl pb-0.5">Your Rooms</h2>
            <p className="text-white/70 font-light text-sm">
              Rooms that you created yourself.
            </p>
          </div>
          {loading ? (
            <div className="py-2">
              <Skeleton className="w-full h-13 bg-white/10" />
            </div>
          ) : owned.length > 0 ? (
            renderRoomList(owned)
          ) : (
            <div className="py-2">
              <div className="border border-white/15 backdrop-blur-xs h-13 flex items-center justify-center rounded-lg text-sm text-white/70">
                No rooms – paste a IIIF URL in the search box to create one
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="pb-2 pl-0.5">
            <h2 className="text-xl pb-0.5">Visited Rooms</h2>
            <p className="text-white/70 font-light text-sm">
              Rooms created by others that you visited.
            </p>
          </div>
          {loading ? (
            <div className="py-2 space-y-2">
              <Skeleton className="w-full h-13 bg-white/10" />
              <Skeleton className="w-full h-13 bg-white/10" />
            </div>
          ) : visited.length > 0 ? (
            renderRoomList(visited)
          ) : (
            <div className="py-2">
              <div className="border border-white/15 backdrop-blur-xs h-13 flex items-center justify-center rounded-lg text-sm text-white/70">
                No visited rooms
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )

}