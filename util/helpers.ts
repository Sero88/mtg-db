export const helpers = {
    officialSetCharLimit: 3, // official sets have 3 chars

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
    },

    getOfficialCardLimit: function(){
        return this.officialSetCharLimit;
    }
}