import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const SKELETON_ROWS = 5

const TableSkeleton = ({ headerCount }: { headerCount: number }) => {
    return (
        Array.from({ length: SKELETON_ROWS }).map((_, index) => (
            <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                {
                    Array.from({ length: headerCount }).map((_, index) => (
                        <TableCell key={index}>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>
                    ))
                }
                <TableCell>
                    <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </TableCell>
            </TableRow>
        ))
    )
}

export default TableSkeleton