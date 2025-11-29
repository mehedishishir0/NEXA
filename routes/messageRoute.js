import express from 'express'
import { protectRoute } from '../middleware/auth.js'
import { getMessage, getUserForSidebar, markMessageAsSeen } from '../controllers/messageControllers.js'

const messageRouter = express.Router()

messageRouter.get("/users", protectRoute, getUserForSidebar )
messageRouter.get("/:id", protectRoute, getMessage )
messageRouter.put("/:id", protectRoute, markMessageAsSeen )

export default messageRouter