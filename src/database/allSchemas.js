import Realm from 'realm'

export const TASKLIST_SCHEMA = 'TaskList'
export const TASK_SCHEMA = 'Task'

export const TaskSchema = {
    name: TASK_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: {
            type: 'string',
            indexed: true
        },
        done: {
            type: 'string',
            default: false
        }
    }
}

export const TaskListSchema = {
    name: TASKLIST_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        taskdetail: 'string'
    }
}

const databaseOption = {
    path: 'senjaBinaApp.realm',
    schema: [TaskSchema, TaskListSchema],
    schemaVersion: 0
}

export const insertNewTaskList = newTaskList => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                let newId = realm.objects(TASKLIST_SCHEMA).max('id')
                newTaskList.id = (typeof newId === 'undefined') ? 1 : newId + 1
                realm.write(() => {
                    realm.create(TASKLIST_SCHEMA, newTaskList)
                    resolve(newTaskList)
                })
            }
        ).catch((error) => reject(error))
})

export const updateTaskList = taskList => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let updatingTaskList = realm.objectForPrimaryKey(TASKLIST_SCHEMA, taskList.id)
                    updateTaskList.name = taskList.name
                    resolve()
                })
            }
        ).catch((error) => reject(error))
})

export const deleteTaskList = taskListId => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let deletingTaskList = realm.objectForPrimaryKey(TASKLIST_SCHEMA, taskListId)
                    realm.delete(deletingTaskList)
                    resolve()
                })
            }
        ).catch((error) => reject(error))
})

export const deletAllTaskList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let allTaskList = realm.objects(TASKLIST_SCHEMA)
                    realm.delete(allTaskList)
                    resolve()
                })
            }
        ).catch((error) => reject(error))
})

export const queryAllTaskList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let allTaskList = realm.objects(TASKLIST_SCHEMA)
                    resolve(allTaskList)
                })
            }
        ).catch((error) => reject(error))
})

export default new Realm(databaseOption)