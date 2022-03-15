import { useEffect, useState } from "react";
import { CardRarityEnum } from "../util/enums/rarityEnums";
import { QuantityRarityTable } from "../components/reports/rarityQuantity";

export default function ReportsPage(){

    const quantity = {
        regular: 0,
        foil: 0,
        unique: 0,
        total: 0,
        sets: 0,
        rarity: {
            common: 0, 
            uncommon: 0,
            rare: 0,
            mythic: 0,
            special: 0,
            bonus: 0,
        }
        
    }

    const prices = {
        rares: 0,
        foil: 0,
        regular: 0,
        total: 0,
    }

    const [reportData, setReportData] = useState({quantity, prices});
    useEffect(() => {
        const endpoint = '';
        fetch('/api/collection/reports?action=cardsTotal')
            .then(response => {return response.json()})
            .then(response =>{
                if(!response.data.length){
                    return;
                }

                const versions = response.data;
                quantity.unique = versions.length;
                const sets = [] as String[];
                
                for(const version of versions){
                    
                    //quantities data
                    let qtyRegular = 0;
                    let qtyFoil = 0;
                    'regular' in version.quantity ? qtyRegular += version.quantity.regular : false;
                    'foil' in version.quantity ? qtyFoil += version.quantity.foil : false;

                    //prices data
                    let priceRegular = 0;
                    let priceFoil = 0;
                    'regular' in version.prices ? priceRegular += version.prices.regular : false;
                    'foil' in version.prices ? priceFoil += version.prices.foil : false;

                    if(version.rarity == CardRarityEnum[CardRarityEnum.rare] || version.rarity == CardRarityEnum[CardRarityEnum.mythic] ){
                        prices.rares += qtyRegular * priceRegular;
                        prices.rares += qtyFoil * priceFoil;
                    }
                    
                    for(let rarityEnum in CardRarityEnum){
                        if(version.rarity == 'special' && (rarityEnum == CardRarityEnum[CardRarityEnum.specialBonus]) ){
                            rarityEnum = 'special';
                        } else if(version.rarity == 'bonus' && (rarityEnum == CardRarityEnum[CardRarityEnum.specialBonus])){ 
                            rarityEnum = 'bonus';
                        }

                        if(rarityEnum === version.rarity){
                            //@ts-ignore
                            quantity.rarity[rarityEnum] += qtyRegular + qtyFoil;
                        }
                    }

                    prices.regular += qtyRegular * priceRegular;
                    prices.foil += qtyFoil * priceFoil;
                    quantity.regular += qtyRegular;
                    quantity.foil += qtyFoil;
                    
                    //get unique sets
                    if(version.set && !sets.includes(version.set)){
                        sets.push(version.set);
                    }
                }

                quantity.total = quantity.regular + quantity.foil;
                quantity.sets = sets.length;
                prices.total = prices.regular + prices.foil;
                

                setReportData({quantity, prices});
            })
            
    },[]);

    

    return (
        <div>
            <h1>Collection Data Overview:</h1>
           
            <div>
                <h2>Quantity Data:</h2>
                <p>Regular Cards: {reportData.quantity.regular}</p>
                <p>Foil Cards: {reportData.quantity.foil}</p>
                <p>Unique Cards: {reportData.quantity.unique}</p>
                <p>Quantity By Rarities:</p>
                <QuantityRarityTable reportData={reportData} />
                <p>Total Cards: {reportData.quantity.total}</p>
                <p>Sets: {reportData.quantity.sets}</p>
            </div>
            
            <div>
                <h2>Price Data:</h2>
                <p>Regular Cards: ${reportData.prices.regular.toFixed(2)}</p>
                <p>Foil Cards: ${reportData.prices.foil.toFixed(2)}</p>
                <p>Rares and Mythics only: ${reportData.prices.rares.toFixed(2)}</p>
                <p>Total Cards: ${reportData.prices.total.toFixed(2)}</p>
            </div>
            
        </div>
        
    );

}