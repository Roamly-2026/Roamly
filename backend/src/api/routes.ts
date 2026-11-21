import { Router } from 'express';
import usersRoutes from './users/users.routes';
import authRoutes from './auth/auth.routes';
import groupsRoutes from './groups/groups.routes';
import filesRoutes from './files/files.routes';
import eventsRoutes from './events/events.routes';
import memoriesRoutes from './memories/memories.routes';

const rootRouter = Router();

rootRouter.use('/users', usersRoutes);
rootRouter.use('/auth', authRoutes);
rootRouter.use('/groups', groupsRoutes);
rootRouter.use('/files', filesRoutes);
rootRouter.use('/events', eventsRoutes);
rootRouter.use('/memories', memoriesRoutes);

export default rootRouter;
