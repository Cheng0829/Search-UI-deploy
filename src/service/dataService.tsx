import {BatchSearchResult, DrugInfo, SearchResult} from '../types';

export const cjkSearch = async (drugAName: string, drugBName: string): Promise<SearchResult> => {
    // http://127.0.0.1:8080/search/${drugAName}&${drugBName}
    // https://5f4ddf95.r7.cpolar.top/search/${drugAName}&${drugBName}
    return fetch(`http://127.0.0.1:8080/search/${drugAName}&${drugBName}`)
        .then(response => response.json())
        .then(data => data as SearchResult)
        .catch(error => {
            console.error('Error:', error);
            // throw error;
            throw new Error('数据库出现了一些故障，请稍后重试！');
        });
}
export const batchCjkSearch = async (index: number, limit: number): Promise<BatchSearchResult> => {
    // http://127.0.0.1:8080/pageSearch/index=${index+1}&limit=${limit}
    // https://5f4ddf95.r7.cpolar.top/pageSearch/index=${index+1}&limit=${limit}
    return fetch(`http://127.0.0.1:8080/pageSearch/index=${index+1}&limit=${limit}`)
        .then(response => response.json())
        .then(data => data as BatchSearchResult)
        .catch(error => {
            console.error('Error:', error);
            // throw error;
            throw new Error('数据库出现了一些故障，请稍后重试！');
        });
}

export const yesDDISearchLLM = async (drugA: DrugInfo, drugB: DrugInfo | undefined, ddiDescription: string): Promise<string> => {
    const drugAName = drugA.name;
    const drugADescription = drugA.description;
    const drugBName = drugB?.name;
    const drugBDescription = drugB?.description;
    const url = `http://127.0.0.1:8290/llm?drugAName=${drugAName}&drugADescription=${drugADescription}&drugBDescription=${drugBDescription}&drugBName=${drugBName}&type=1&ddiDescription=${ddiDescription}`.replace(/ /g, '%20');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.text();
    } catch (error) {
        return "服务器维护中，请稍后再试~";
    }
}

export const notDDISearchLLM = async (drugA: DrugInfo, drugB: DrugInfo | undefined ): Promise<string> => {
    const drugAName = drugA.name;
    const drugADescription = drugA.description;
    const drugBName = drugB?.name;
    const drugBDescription = drugB?.description;
    const url = `http://127.0.0.1:8290/llm?drugAName=${drugAName}&drugADescription=${drugADescription}&drugBDescription=${drugBDescription}&drugBName=${drugBName}&type=2`.replace(/ /g, '%20');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.text();
    } catch (error) {
        return "服务器维护中，请稍后再试~";
    }
}

export const loginVerify = async (username: string, password: string): Promise<string> => {
    try {
        const response = await fetch(`http://127.0.0.1:8080/loginVerify/${username}&${password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 假设后端返回的是纯文本
        return await response.text();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};