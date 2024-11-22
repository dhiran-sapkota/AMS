import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import useDebounce from "@/hooks/use-debounce"

type props = {
    setSearch : React.Dispatch<React.SetStateAction<string>>
}

const Search = ({setSearch}:props) => {
  const [searchValue, setSearchValue] = useState("")
   const lateSearch =  useDebounce(searchValue)
    useEffect(()=>{
        setSearch(searchValue)
    }, [lateSearch])
  return (
    <div>
        <Input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} placeholder="Search"  />
    </div>
  )
}

export default Search