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
        perform_datetime: 'string',
        perform_staff: 'string'
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
        datetime: 'string',
        status: 'string',
        perform_staff: 'string'
    }
}

const databaseOption = {
    path: 'senjaBinaApp.realm',
    schema: [TaskSchema, TaskListSchema, TaskDoneSchema],
    schemaVersion: 6
}

export const insertNewTaskDone = newTaskDone => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                let newId = realm.objects(TASK_DONE_SCHEMA).max('id')
                newTaskDone.id = (typeof newId === 'undefined' ? 1 : newId + 1)
                realm.write(() => {
                    realm.create(TASK_DONE_SCHEMA, newTaskDone)
                    console.log(newTaskDone)
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
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let updatingTaskList = realm.objectForPrimaryKey(TASKLIST_SCHEMA, taskList.id)
                    updatingTaskList.status = taskList.status
                    updatingTaskList.perform_datetime = taskList.datetime
                    updatingTaskList.perform_staff = taskList.perform_staff
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

export const queryAllTaskListOpen = () => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let allTaskList = realm.objects(TASKLIST_SCHEMA).filtered('status=""')
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
                    let allTaskDone = realm.objects(TASK_DONE_SCHEMA).filtered('status!="uploaded"')
                    resolve(allTaskDone)
                })
            }
        ).catch((error) => reject(error))
        
})

export const queryNotUploadYetCompletedTask = () => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let allTaskDone = realm.objects(TASK_DONE_SCHEMA).filtered('status!="uploaded"')
                    resolve(allTaskDone)
                })
            }
        ).catch((error) => reject(error))
        
})

export const queryCompletedTask = taskId => new Promise((resolve, reject) => {
    console.log('inn')
    Realm.open(databaseOption)
    .then(
        realm => {
            realm.write(() => {
                let taskdetail = realm.objects(TASK_DONE_SCHEMA).filtered('id="'+ taskId+'"')
                console.log(taskdetail);
                resolve(taskdetail)
            })
        }
    ).catch((error) => reject(error))
})

export const sewaccCompletedFilter = sewacc => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let filteredCompletedSewacc = realm.objects(TASK_DONE_SCHEMA).filtered('seq_id="' + sewacc + '"')
                    resolve(filteredCompletedSewacc)
                })
            }
        ).catch((error)=> reject(error))
})

export const updateTaskDone = taskList => new Promise((resolve, reject) => {
    console.log(taskList)
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let updatingTaskList = realm.objectForPrimaryKey(TASK_DONE_SCHEMA, taskList.id)
                    updatingTaskList.taskperform = taskList.taskperform
                    updatingTaskList.status = taskList.status
                    resolve(updatingTaskList)
                })
            }
        ).catch((error) => reject(error))
})

export const deletAllTaskCompletedTask = () => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let allTask = realm.objects(TASK_DONE_SCHEMA)
                    realm.delete(allTask)
                    resolve()
                })
            }
        ).catch((error) => reject(error))
})

export const taskUploaded = () => new Promise((resolve, reject) => {
    Realm.open(databaseOption)
        .then(
            realm => {
                realm.write(() => {
                    let uploaded = realm.objects(TASK_DONE_SCHEMA).filtered('status="uploaded"')
                    resolve(uploaded)
                })
            }
        ).catch((error) => reject(error))
})

export default new Realm(databaseOption)