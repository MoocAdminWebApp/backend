const {ValidationException } = require('./commonError');
const {Menu} = require('../models');

const validateMenuData = (data) => {
    const {
        title,
        type,
        parentId,
        orderNum,
        path,
        component,
        permission,
        hidden,
        status,
        comment
    }   = data;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        throw new ValidationException('Title is required and must be a non-empty string');
    }

    const validStatuses = async () => {
        const statusList = await Menu.findAll({
            attributes: ['status'],
            group: ['status']
        });
        return statusList.map(s => s.status);
    }
    if (!status || !validStatuses.includes(type)) {
        throw new ValidationException('Status field is required and must be selected from: ' + validStatuses.join(', '));
    }

    const validTypes = async () => {
        const typeList = await Menu.findAll({
            attributes: ['type'],
            group: ['type']
        });
        return typeList.map(t => t.type);
    }
    if (!type || !validTypes.includes(type)) {
        throw new ValidationException('Type field is required and must be selected from: ' + validTypes.join(', '));
    }

    
}