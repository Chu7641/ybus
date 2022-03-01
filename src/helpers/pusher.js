import config from '../config';

var pusher = new window.Pusher('2bae7f804ef1483a7795', {
    cluster: 'ap1',
    forceTLS: true,
    authEndpoint: `${config.API_URL}/pusher/auth`,
    authTransport: 'ajax'
});

export default pusher;