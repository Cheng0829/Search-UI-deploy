// src/components/Sidebar.tsx

import React, {useEffect, useState} from 'react';
import {DDIResult, DrugInfo} from '../types';
import {notDDISearchLLM, yesDDISearchLLM} from "../service/dataService";


interface SidebarProps {
    ddiInfo: {
        "drugA": DrugInfo;
        "drugB"?: DrugInfo;
        "ddi": { [key: string]: DDIResult }; // 使用索引签名来表示任意键的 DDIResult 对象
    }
}

export const Sidebar: React.FC<SidebarProps> = ({ddiInfo}) => {

    // 状态变量用于存储结果
    const [notDDILLMResult, setNotDDILLMResult] = useState('');
    const [showNotDDILLMResult, setShowNotDDILLMResult] = useState(false);
    const [yesDDILLMResult, setYesDDILLMResult] = useState('');
    const [showYesDDILLMResult, setShowYesDDILLMResult] = useState(false);
    const [llmAnalyzing, setLlmAnalyzing] = useState(false);

    // 处理按钮点击事件
    const handleNotDDIButtonClick = async () => {
        setLlmAnalyzing(true)
        setNotDDILLMResult('');
        setShowNotDDILLMResult(false);

        const data = notDDISearchLLM(ddiInfo.drugA, ddiInfo.drugB)
        setNotDDILLMResult(await data);
        setShowNotDDILLMResult(true);
        setLlmAnalyzing(false)
    };
    const handleYesDDIButtonClick = async (ddiDescription: string) => {
        setLlmAnalyzing(true)
        // ddiInfo.ddi.description
        setYesDDILLMResult('');
        setShowYesDDILLMResult(false);
        const data = yesDDISearchLLM(ddiInfo.drugA, ddiInfo.drugB, ddiDescription)
        setYesDDILLMResult(await data);
        setShowYesDDILLMResult(true);
        setLlmAnalyzing(false)
    };

    // 重置状态的 useEffect 钩子
    useEffect(() => {
        // 每次 ddiInfo 变化时重置状态
        setNotDDILLMResult('');
        setShowNotDDILLMResult(false);
        setYesDDILLMResult('');
        setShowYesDDILLMResult(false);
        setLlmAnalyzing(false)
    }, [ddiInfo]);

    if (!ddiInfo) return null;
    // console.log(ddiInfo);

    const hasDrugBKey = 'drugB' in ddiInfo;
    // console.log('hasDrugBKey: ', hasDrugBKey);
    // console.log('!ddiInfo.drugB: ', !ddiInfo.drugB);
    // console.log('ddiInfo: ', ddiInfo);

    // 正常的只查单个药物的情况：药物A不存在，药物B为空
    if (!ddiInfo.drugA && !hasDrugBKey)
        return (
            <div className="error-Drug-null">
                <div>
                    <h2>Search Result</h2>
                    <p>暂无药物A信息</p>
                </div>
            </div>
        );

    // if(!ddiInfo.drugA || !ddiInfo.drugB || hasDrugBKey)
    //     console.log('!ddiInfo.drugA || (!ddiInfo.drugB && hasDrugBKey)');
    if (!ddiInfo.drugA || !ddiInfo.drugB || !hasDrugBKey)
        return (
            <div className="error-Drug-null">
                <h2>Search Result</h2>
                {!ddiInfo.drugA && (
                    <div>
                        <p>暂无药物A信息</p>
                    </div>
                )}
                {ddiInfo.drugA && (
                    <div>
                        {ddiInfo.drugA.name && <h3>Drug A: {ddiInfo.drugA.name}</h3>}
                        {/*{ddiInfo.drugA.drugbankId &&*/}
                        {/*    <p><strong>DrugbankID:</strong><br/> {ddiInfo.drugA.drugbankId}</p>}*/}
                        {ddiInfo.drugA.category && <p><strong>Category:</strong><br/> {ddiInfo.drugA.category} etc.</p>}
                        {ddiInfo.drugA.chemicalFormula &&
                            <p><strong>Chemical Formula:</strong><br/> {ddiInfo.drugA.chemicalFormula}</p>}
                        {ddiInfo.drugA.smiles && <p><strong>SMILES:</strong><br/> {ddiInfo.drugA.smiles}</p>}
                        {ddiInfo.drugA.description &&
                            <p><strong>Description:</strong><br/> {ddiInfo.drugA.description}</p>}
                        {ddiInfo.drugA.relatedDrugs &&
                            <p><strong>Related Drugs:</strong><br/> {ddiInfo.drugA.relatedDrugs} etc.</p>}
                        {ddiInfo.drugA.pharmacodynamics &&
                            <p><strong>Pharmacodynamics:</strong><br/> {ddiInfo.drugA.pharmacodynamics}</p>}
                        {ddiInfo.drugA.actionMechanism &&
                            <p><strong>Action Mechanism:</strong><br/> {ddiInfo.drugA.actionMechanism}</p>}
                        {ddiInfo.drugA.proteinBinding &&
                            <p><strong>Protein Binding:</strong><br/> {ddiInfo.drugA.proteinBinding}</p>}
                        {ddiInfo.drugA.metabolism &&
                            <p><strong>Metabolism:</strong><br/> {ddiInfo.drugA.metabolism}</p>}
                        <img src={`drugImage/${ddiInfo.drugA.name}.png`} alt=""/>
                    </div>
                )}
                {hasDrugBKey && !ddiInfo.drugB && (
                    <div>
                        <p>暂无药物B信息</p>
                    </div>
                )}
                {hasDrugBKey && ddiInfo.drugB && (
                    <div>
                        {ddiInfo.drugB.name && <h3>Drug B: {ddiInfo.drugB.name}</h3>}
                        {/*{ddiInfo.drugB.drugbankId &&*/}
                        {/*    <p><strong>DrugbankID</strong>:<br/> {ddiInfo.drugB.drugbankId}</p>}*/}
                        {ddiInfo.drugB.category && <p><strong>Category:</strong><br/> {ddiInfo.drugB.category} etc.</p>}
                        {ddiInfo.drugB.chemicalFormula &&
                            <p><strong>Chemical Formula:</strong><br/> {ddiInfo.drugB.chemicalFormula}</p>}
                        {ddiInfo.drugB.smiles && <p><strong>SMILES:</strong><br/>{ddiInfo.drugB.smiles}</p>}
                        {ddiInfo.drugB.description &&
                            <p><strong>Description:</strong><br/> {ddiInfo.drugB.description}</p>}
                        {ddiInfo.drugB.relatedDrugs &&
                            <p><strong>Related Drugs:</strong><br/> {ddiInfo.drugB.relatedDrugs} etc.</p>}
                        {ddiInfo.drugB.pharmacodynamics &&
                            <p><strong>Pharmacodynamics:</strong><br/> {ddiInfo.drugB.pharmacodynamics}</p>}
                        {ddiInfo.drugB.actionMechanism &&
                            <p><strong>Action Mechanism:</strong><br/> {ddiInfo.drugB.actionMechanism}</p>}
                        {ddiInfo.drugB.proteinBinding &&
                            <p><strong>Protein Binding:</strong><br/> {ddiInfo.drugB.proteinBinding}</p>}
                        {ddiInfo.drugB.metabolism &&
                            <p><strong>Metabolism:</strong><br/> {ddiInfo.drugB.metabolism}</p>}
                        <img src={`drugImage/${ddiInfo.drugB.name}.png`} alt=""/>
                    </div>
                )}
            </div>
        );
    return (
        <div className="sidebar">
            <h2>Search Result</h2>
            <div>
                {ddiInfo.drugA.name && <h3>Drug A: {ddiInfo.drugA.name}</h3>}
                {/*{ddiInfo.drugA.drugbankId && <p><strong>DrugbankID:</strong><br/> {ddiInfo.drugA.drugbankId}</p>}*/}
                {ddiInfo.drugA.category && <p><strong>Category:</strong><br/> {ddiInfo.drugA.category} etc.</p>}
                {ddiInfo.drugA.chemicalFormula &&
                    <p><strong>Chemical Formula:</strong><br/> {ddiInfo.drugA.chemicalFormula}</p>}
                {ddiInfo.drugA.smiles && <p><strong>SMILES:</strong><br/> {ddiInfo.drugA.smiles}</p>}
                {ddiInfo.drugA.description && <p><strong>Description:</strong><br/> {ddiInfo.drugA.description}</p>}
                {ddiInfo.drugA.relatedDrugs && <p><strong>Related Drugs:</strong><br/> {ddiInfo.drugA.relatedDrugs} etc.</p>}
                {ddiInfo.drugA.pharmacodynamics &&
                    <p><strong>Pharmacodynamics:</strong><br/> {ddiInfo.drugA.pharmacodynamics}</p>}
                {ddiInfo.drugA.actionMechanism &&
                    <p><strong>Action Mechanism:</strong><br/> {ddiInfo.drugA.actionMechanism}</p>}
                {ddiInfo.drugA.proteinBinding &&
                    <p><strong>Protein Binding:</strong><br/> {ddiInfo.drugA.proteinBinding}</p>}
                {ddiInfo.drugA.metabolism && <p><strong>Metabolism:</strong><br/> {ddiInfo.drugA.metabolism}</p>}
                <img src={`drugImage/${ddiInfo.drugA.name}.png`} alt=""/>
            </div>

            {hasDrugBKey && ddiInfo.drugB && (
                <div>
                    {ddiInfo.drugB.name && <h3>Drug B: {ddiInfo.drugB.name}</h3>}
                    {/*{ddiInfo.drugB.drugbankId && <p><strong>DrugbankID</strong>:<br/> {ddiInfo.drugB.drugbankId}</p>}*/}
                    {ddiInfo.drugB.category && <p><strong>Category:</strong><br/> {ddiInfo.drugB.category} etc.</p>}
                    {ddiInfo.drugB.chemicalFormula &&
                        <p><strong>Chemical Formula:</strong><br/> {ddiInfo.drugB.chemicalFormula}</p>}
                    {ddiInfo.drugB.smiles && <p><strong>SMILES:</strong><br/>{ddiInfo.drugB.smiles}</p>}
                    {ddiInfo.drugB.description && <p><strong>Description:</strong><br/> {ddiInfo.drugB.description}</p>}
                    {ddiInfo.drugB.relatedDrugs &&
                        <p><strong>Related Drugs:</strong><br/> {ddiInfo.drugB.relatedDrugs} etc.</p>}
                    {ddiInfo.drugB.pharmacodynamics &&
                        <p><strong>Pharmacodynamics:</strong><br/> {ddiInfo.drugB.pharmacodynamics}</p>}
                    {ddiInfo.drugB.actionMechanism &&
                        <p><strong>Action Mechanism:</strong><br/> {ddiInfo.drugB.actionMechanism}</p>}
                    {ddiInfo.drugB.proteinBinding &&
                        <p><strong>Protein Binding:</strong><br/> {ddiInfo.drugB.proteinBinding}</p>}
                    {ddiInfo.drugB.metabolism && <p><strong>Metabolism:</strong><br/> {ddiInfo.drugB.metabolism}</p>}
                    <img src={`drugImage/${ddiInfo.drugB.name}.png`} alt=""/>
                </div>
            )}

            {(Object.keys(ddiInfo.ddi).length !== 0) && ddiInfo.ddi && (
                <div>
                    <h3>DDI Information</h3>
                    {/* 输出所有的 DDI 类型和描述 */}
                    {Object.keys(ddiInfo.ddi).map((ddiType, index) => (
                        <div key={index}>
                            {/*{ddiType && <p><strong>DDI Type:</strong> {ddiType}</p>}*/}
                            <p> 此DDI已由生物医学实验验证。</p>
                            {ddiInfo.ddi[ddiType].description &&
                                <p><strong>DDI Description:</strong> {ddiInfo.ddi[ddiType].description}</p>}
                            {ddiInfo.ddi[ddiType].confidence &&
                                <p><strong>Model Confidence:</strong> {ddiInfo.ddi[ddiType].confidence}</p>}
                            <button onClick={() => handleYesDDIButtonClick(ddiInfo.ddi[ddiType].description)}>点击查询LLM分析</button>
                            {llmAnalyzing && <div>LLM正在分析中...</div>}
                            {!llmAnalyzing && showYesDDILLMResult && <div>{yesDDILLMResult}</div>}
                        </div>
                    ))}
                </div>
            )}
            {(Object.keys(ddiInfo.ddi).length === 0) && ddiInfo.ddi && (
                <div>
                    <h3>暂无相关DDI信息！</h3>
                    <button onClick={handleNotDDIButtonClick}>点击查询模型预测结果及LLM分析</button>
                    {llmAnalyzing && <div>LLM正在分析中...</div>}
                    {/* 只有当 showResult 为 true 时才显示查询结果 */}
                    {!llmAnalyzing && showNotDDILLMResult && <div>{notDDILLMResult}</div>}
                </div>
            )}
        </div>
    );
};

