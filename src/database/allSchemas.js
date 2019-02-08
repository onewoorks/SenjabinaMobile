import Realm from 'realm'

export const TASKLIST_SCHEMA = 'TaskList'
export const TASK_SCHEMA = 'Task'
export const TASK_DONE_SCHEMA = 'TaskDone'

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
        seq_id: 'string',
        taskdetail: 'string',
        status: 'string',
        perform_datetime: 'string'
    }
}

export const TaskDoneSchema = {
    name: TASK_DONE_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        seq_id: 'string',
        taskdetail: 'string',
        taskperform: 'string',
        datetime: 'string'
    }
}

const databaseOption = {
    path: 'senjaBinaApp.realm',
    schema: [TaskSchema, TaskListSchema, TaskDoneSchema],
    schemaVersion: 4
}

export const insertNewTaskDone = newTaskDone => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                let newId = realm.objects(TASK_DONE_SCHEMA).max('id')
                newTaskDone.id = (typeof newId === 'undefined' ? 1 : newId + 1)
                realm.write(() => {
                    realm.create(TASK_DONE_SCHEMA, newTaskDone)
                    resolve(newTaskDone)
                })
            }
        ).catch((error) => reject(error))
})

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
    console.log(taskList)
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let updatingTaskList = realm.objectForPrimaryKey(TASKLIST_SCHEMA, taskList.id)
                    updatingTaskList.status = taskList.status
                    updatingTaskList.perform_datetime = taskList.datetime
                    resolve(updatingTaskList)
                })
            }
        ).catch((error) => reject(error))
})

export const sewaccFilter = sewacc => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let filteredSewacc = realm.objects(TASKLIST_SCHEMA).filtered('seq_id="' + sewacc + '"')
                    resolve(filteredSewacc)
                })
            }
        )
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

export const queryAllCompletedTask = () => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let allTaskDone = realm.objects(TASK_DONE_SCHEMA)
                    resolve(allTaskDone)
                })
            }
        ).catch((error) => reject(error))
        
})

export default new Realm(databaseOption)