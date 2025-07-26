function convertDataToTree(flatList, parentId = null) {
  const tree = [];
  flatList.forEach(node => {
    // Check if the node's parentId matches the current parentId
    if (node.parentId === parentId) {
      // Iterating through the flatList to find children
      const children = convertDataToTree(flatList, node.id);
      if (children.length > 0) {
        node.dataValues.children = children;
      }
      tree.push(node);
    }
  });
  return tree;
}

module.exports = convertDataToTree;
