// @author  : Junkai Cheng
// @time    : 2024/9/28 18:19

export interface DrugInfo {
    orderId: string;
    chemicalFormula: string;
    drugbankId: string;
    smiles: string;
    name: string;
    description: string;
    category: string;
    relatedDrugs: string; // 注意：这里应该是字符串数组，所以应该改为string[]

    pharmacodynamics: string;
    actionMechanism: string;
    proteinBinding: string;
    metabolism: string;
}

export interface DDIResult {
    confidence: string;
    description: string;
}

export interface SearchResult {
    "drugA": DrugInfo;
    "drugB"?: DrugInfo;
    "ddi": { [key: string]: DDIResult }; // 使用索引签名来表示任意键的 DDIResult 对象
}

export interface BatchSearchResult {
    items: Array<{
        drugAName: string;
        drugBName: string;
        ddiDescription: string;
    }>;
}