import RenderPage from "./render-page";
interface Props {
  params: Promise<{ category: string, num: string }>
}
export function metadata({params}:Props){
  return {
    title: "Trang chủ",
    description: "Album page",
  };
}
export default async function Page({
  params,
}:Props) {
  const slug_category = (await params).category
  const slug_num = (await params).num
  return(
    <RenderPage slug_category={slug_category} slug_num={slug_num} />
  )
}