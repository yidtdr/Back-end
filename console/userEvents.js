class UserEvents{
    static logDisconnected(username)
    {
        console.log(
            "[USER_INFO] " + username + " DISCONNECTED"
        )
    }
    
    static logConnected(username)
    {
        console.log(
            "[USER_INFO] " + username + " CONNECTED"
        )
    }
}

module.exports = UserEvents;