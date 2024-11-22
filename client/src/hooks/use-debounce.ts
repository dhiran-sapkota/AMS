import { useEffect, useState } from "react"

const useDebounce = (value:string) => {
    const [debouncedValue, setDebouncedValue] = useState("")

    useEffect(()=>{
        const interval = setTimeout(()=>{
            setDebouncedValue(value)
        }, 500)
        return () => clearTimeout(interval)
    }, [value])

    return debouncedValue
}

export default useDebounce