export const helpers = {
    collectionApiResponse: function(status:string, message:string, data = {}){
        return {
            status,
            message, 
            data
        }
    },

    convertNameToId(name:string):string{
        const convertedName = name.replace(" ", "-");
        return convertedName;
    }
}