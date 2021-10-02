export const helpers = {
    collectionApiResponse: function(status, message, data = []){
        return {
            status,
            message, 
            data
        }
    },
}