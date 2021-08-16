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

export const deleteItem = `
mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
}
`;
