import { ChannelBean } from "../beans/channel";

const URL = require('url');

//https://www.facebook.com/michelledbev/videos/2371969676206729/
export function parseFbLiveUrl(liveUrl: string): ChannelBean {
    const u = URL.parse(liveUrl);
    const path = u.path;
    const res = path.replace('/videos/', '&').replace(/\//g, '').split('&')
    return {
        url: liveUrl,
        channel: res[0],
        videoId: parseInt(res[1])
    };
}