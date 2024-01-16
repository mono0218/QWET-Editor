import Image from 'next/image'

export default async function Home() {
  let json

  await fetch("https://api.songle.jp/api/v2/apps/2457/stages.json?syntax=camelcase&token=GVkVZDMb8PPnioN3NiDBHPdhhCYvzYGz",{ cache: "no-store" }) .then(response => response.json()).then(data => {json = data});
  return(
  )
}
