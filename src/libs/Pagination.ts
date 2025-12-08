export interface Pagination<Item> {
    data: Item[]
    pagination: {
        limit: 0,
        nextCursor: string,
        hasMore: boolean
    }
}