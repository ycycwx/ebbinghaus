export const addItem = `
mutation AddItem($name: String!, $link: String, $desc: String) {
    addItem(name: $name, link: $link, desc: $desc)
}
`;

export const updateItem = `
mutation UpdateItem($id: ID!, $name: String!, $link: String, $desc: String) {
    updateItem(id: $id, name: $name, link: $link, desc: $desc)
}
`;

export const updateStage = `
mutation UpdateStage($id: ID!) {
    updateStage(id: $id)
}
`;

export const updateUpdateTime = `
mutation UpdateUpdateTime($id: ID!) {
    updateUpdateTime(id: $id)
}
`;

export const deleteItem = `
mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
}
`;

export const resetItem = `
mutation ResetItem($id: ID!) {
    resetItem(id: $id)
}
`;
