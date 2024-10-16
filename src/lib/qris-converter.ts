const convertCRC16 = (str: string) => {
    let crc = 0xFFFF
    const strlen = str.length
    for (let c = 0; c < strlen; c++) {
        crc ^= str.charCodeAt(c) << 8
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021
            } else {
                crc = crc << 1
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
}

export function qrisConverter(
    {qrisCode, amount, feeType, fee} : {qrisCode : string, amount : number, feeType : string | undefined, fee : number}
){
    let qris = qrisCode.slice(0, -4)
    qris = qris.replace("010211", "010212")
    const [part1, part2] = qris.split("5802ID")

    let uang = `54${amount.toString().length.toString().padStart(2, '0')}${amount}`

    if (!!feeType) {
        const feeCode = feeType === 'rupiah' ? '55020256' : '55020357'
        uang += `${feeCode}${fee.toString().length.toString().padStart(2, '0')}${fee}`
    }

    uang += "5802ID"

    const fix = `${part1}${uang}${part2}`
    return `${fix}${convertCRC16(fix)}`
}