let inputArr=process.argv.slice(2);
let fs=require("fs");
let path=require("path");
let types={
   media:["mp4","mkv"],
   archives:["zip","rar","iso"],
   documents:["docx","doc","ppt","pptx","txt"],
   app:["exe","pkg"]
}

let command=inputArr[0];
switch(command)
{
    case "organise":
      organiseFn(inputArr[1]);
      break;
    case "tree":
       treeFn(inputArr[1]);
       break;
    case "help":
       helpFn();
       break;
}

function treeFn(dirpath)
{
   if(dirpath==undefined)
   {//console.log("kindly enter the path");
   treehelper(process.cwd(),"")
   return;} 
   else{
    let doesexist=fs.existsSync(dirpath);
    //let destpath;
    if(doesexist)
    {
      treehelper(dirpath,"")   }
    else
    {
        console.log("enter correct path");
        return;
    }
   }

}
function treehelper(dirpath,indent)
{
    let isfile=fs.lstatSync(dirpath).isFile();
    if(isfile)
    {let filename=path.basename(dirpath);
   console.log(indent+"------"+filename);
   }
    else
    {
    let dirname=path.basename(dirpath);
     console.log(indent +"-----"+dirname);
     let children=fs.readdirSync(dirpath);
     for(let i=0;i<children.length;i++)
     {let childpath=path.join(dirpath,children[i]);
       treehelper(childpath,indent+"\t");
     } 
   }
}


function organiseFn(dirpath)
{let destpath;
   if(dirpath==undefined)
   {//console.log("kindly enter the path");
   destpath=process.cwd();
      return;} 
   else{
    let doesexist=fs.existsSync(dirpath);
    
    if(doesexist)
    {
       destpath=path.join(dirpath,"organised files");
      if(fs.existsSync(destpath)==false)
      fs.mkdirSync(destpath);
    }
    else
    {
        console.log("enter correct path");
        return;
    }
    organiserhelper(dirpath,destpath)
   }
}
function organiserhelper(src,des)
{
let childname=fs.readdirSync(src);
//console.log(childname);
for(let i=0;i<childname.length;i++)
{
   let childadd=path.join(src,childname[i]);
   let isfile=fs.lstatSync(childadd).isFile();
   if(isfile)
   {
      //console.log(childname[i]);
     let category= getcategory(childname[i]);
      console.log(childname[i],"belongs to  ---->",category);
      sendfiles(childadd,des,category);
   }

}

}
function sendfiles(srcfilepath,des,category){
let categorypath=path.join(des,category);
if(fs.existsSync(categorypath)==false)
{
   fs.mkdirSync(categorypath);
}
let filename=path.basename(srcfilepath);
let destfilepath=path.join(categorypath,filename);
fs.copyFileSync(srcfilepath,destfilepath);
console.log(filename,"copied to",category);
}
function getcategory(name){
   let ext=path.extname(name);
   ext=ext.slice(1);
   //console.log(ext);
   for(let type in types)
   {
      let ctypearray=types[type];
      for(let i=0;i<ctypearray.length;i++)
      {
         if(ext == ctypearray[i])
         {
            return type;
         }
      }
   }
   return "others";
}




function helpFn()
{
    console.log(`
    List of commands
    tree dirpath
    organise dirpath
    `);
}

