import db from '../lib/db'
import FbUser from './fb_users'
import FbChannel from './fb_channels'
import FbComments from './fb_comments'
import FbTask from './fb_tasks'

export function installModels(db) {

}
installModels(db);

export default {
    FbUser: FbUser,
    FbChannel: FbChannel,
    FbComments: FbComments,
    FbTask: FbTask
}
export const connection = db;