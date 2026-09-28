export function pluralizePl(count: number, one: string, few: string, many: string) {
 const value=Math.abs(count)
 const last=value%10
 const lastTwo=value%100
 if(value===1)return one
 if(last>=2&&last<=4&&(lastTwo<12||lastTwo>14))return few
 return many
}
