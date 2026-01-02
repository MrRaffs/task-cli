#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from "fs";

let tasks = [];
const taskFile = 'task.json';

function getTime(){
    let timestamp = new Date(Date.now());
    let date = timestamp.toString() //Tue Dec 23 2025 10:41:55 GMT+0700 (Western Indonesia Time)
    return (date.slice(0,date.indexOf("GMT"))); //Tue Dec 23 2025 10:41:55 
}

class Task{
    constructor(description, status='todo'){
        this.idGen();
        this.description = description;
        this.status = status;
        this.createdAt = getTime();
        this.updatedAt = null;
    }

    idGen(){
        this.id = 1;
        let ids =[];
        //task still empty just return 1
        if(tasks.length == 0) {
            return;
        }
        //put all ids in array
        for(let task of tasks){
            ids.push(task.id);
        }
        // console.log('list of ids:', ids);
        
        // check if id already exist
        while(ids.includes(this.id)){
            this.id++;
        }
        // console.log('newID:', this.id);
        //idk this might be computationally expensive
    }
}

function readDB(){//I think I need to learn js async first...
    //I think I understand it now
    return new Promise((resolve, reject)=>{
        try {
            const data = fs.readFileSync(taskFile, {encoding: 'utf8', flag:'a+'}); //a+ flag so it create the json if it doesn't exist
            
            if(data !== "") tasks = JSON.parse(data);
            
            resolve('Read success');
        } catch (error) {
            console.log('==>> Error reading files: ', error);
            reject();
        }
    })
}

function writeDB(){
    fs.writeFile(taskFile, JSON.stringify(tasks), (error)=>{
        if(error){
            console.error(error);
            throw error;
        }
        // console.log('json write successfull');
    })
}

function printTask(task){
    console.log('ID: ',task.id);
    console.log(`Task: "${task.description}"`);
    console.log('Status: ',task.status);
    console.log('Created: ',task.createdAt);
    console.log('Updated: ',task.updatedAt);
}

async function listTask(status='all'){
    await readDB();
    console.log(`List ${status} tasks :\n=======================`);
    if(tasks.length == 0) console.log('Your todo list is clear!');
    for(let task of tasks){
        if(task.status === status && status !== 'all'){
            printTask(task);
        } else if (status === 'all') {
            printTask(task);
        }
    }
}

async function updateTask(id, newDescription){
    if(Number.isNaN(id)) {
        console.log('ID must be a number'); 
        return;
    }

    await readDB();
    
    const index = tasks.findIndex(task => task.id === id)
    if(index === -1) {
        console.log('ID not found');
        return;
    }
    tasks[index].description = newDescription;
    tasks[index].updatedAt = getTime();
    
    printTask(tasks[index]);

    writeDB();
}

async function deleteTask(id){
    if(Number.isNaN(id)) {
        console.log('ID must be a number'); 
        return;
    }

    await readDB();
    
    const index = tasks.findIndex(task => task.id === id); //self explanatory
    if(index === -1) {
        console.log('ID not found');
        return;
    }
    const deleted = tasks.splice(index, 1);
    console.log('Task deleted :');
    printTask(deleted[0]);
    
    writeDB();
}

async function markTask(id, newStatus){
    await readDB();
    
    const index = tasks.findIndex(task => task.id === id);
    if(index === -1) {
        console.log('ID not found');
        return;
    }
    tasks[index].status = newStatus;
    tasks[index].updatedAt = getTime();
    console.log(`Task updated as ${newStatus} :`);
    printTask(tasks[index]);
    
    writeDB();
}

const program = new Command();
program
    .name('task-cli')
    .description('CLI based task tracker')
    .version('0.1.0')

program
    .command('add <description>')
    .description('add new task')
    .action(
        async (description)=>{
            await readDB();
                        
            const task = new Task(description)
            
            //write to JSON
            try {
                //push to tasks stack (unshift)
                tasks.unshift(task);

                writeDB()
            } catch (error) {
                console.log(error);
            }

            console.log(`Task added successfully ${task.id}`);
    })

program
    .command('list [status]')
    .description('list all task\n- list\t\t\tlist all task\n- list done\t\tlist all task that are done\n- list todo\t\tlist all task that are todo\n- list in-progress\tlist all task that are inprogress')
    .action(
        (status) => {
            //default list all
            switch(status){
                case 'todo':
                    listTask('todo');
                    break;
                case 'done':
                    listTask('done');
                    break;
                case 'in-progress':
                    listTask('in-progress');
                    break;
                case undefined:
                    listTask();
                    break;
                default:
                    console.log('invalid command!!\nlist of commands :\n- list\t\t\tlist all task\n- list done\t\tlist all task that are done\n- list todo\t\tlist all task that are todo\n- list in-progress\tlist all task that are inprogress')
                    break;
            }
            
        }
    )

program
    .command('update <id> <description>')
    .description('Update task status by ID')
    .action(
        (id, description)=>{
            updateTask(parseInt(id),description);
        }
    )

program
    .command('delete <id>')
    .description('Delete task by ID')
    .action(
        (id) => {
            deleteTask(parseInt(id));
        }
    )

program
    .command('mark-done <id>')
    .description('Update task status as done using id')
    .action(
        (id) => {
            markTask(parseInt(id),'done');
        }
    )
program
    .command('mark-todo <id>')
    .description('Update task status as todo using id')
    .action(
        (id) => {
            markTask(parseInt(id),'todo');
        }
    )
program
    .command('mark-in-progress <id>')
    .description('Update task status as in progress using id')
    .action(
        (id) => {
            markTask(parseInt(id),'in-progress');
        }
    )
program.parse();