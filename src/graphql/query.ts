export const getItem = `
query GetItem($id: ID!) {
    item(id: $id) {
        id
        name
        link
        desc
    }
}
`;

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
