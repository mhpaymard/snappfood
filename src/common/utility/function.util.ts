export function isBoolean(value:any){
    return ['false',false,'true',true].includes(value)
}
export function toBoolean(value:any){
    return [true,"true"].includes(value)?true:false;
}
export function isNumber(value:any){
    return !isNaN(parseInt(value.toString()))
}