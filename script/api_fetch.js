// for getting data with to authentication
export async function getData(url, options=null) {
    try {
        // request w/out authentication
        if (!options){
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }else{ // request w/ authentication
            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                console.clear();
                return {
                    error: response.status,
                    data: data
                };
            }
            return data;
        }
    } catch (error) {
        return console.error(error);
    }
}

// for setting data with no authentication
export async function setData(url, options) {
    try {
        const response = await fetch(url, options);
        
        if(response.status === 204){
            return response;
        }else if(!response.ok) {
            // console.clear();
            return {
                error: response.status,
                data: await response.json(),
            };
        }
        return await response.json();
    } catch (error) {
        return console.error(error);
    }
}