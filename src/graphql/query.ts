export const getItems = `
query GetItems($variant: String = "all") {
    items(variant: $variant) {
        id
        name
        link
        desc
        createTime
        updateTime
        stage
    }
}
`;
