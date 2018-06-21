var templateSource = "pragma solidity ^0.4.2;\n\ncontract Ballot {\n\n    address owner;\n\n    constructor() public { owner = msg.sender; }\n\n}";
var optimize = 1;
var compiler;

function getSourceCode() {
    return document.getElementById("solSource").value;
}

function getVersion() {
    return document.getElementById("versions").value;
}

function status(txt) {
    document.getElementById("status").innerHTML = txt;
}

function listVersions(versions) {
    sel = document.getElementById("versions");
    sel.innerHTML = "";

    for(var i = 0; i < versions.length; i++) {
        var opt = document.createElement('option');
        opt.appendChild( document.createTextNode(versions[i]) );
        opt.value = versions[i]; 
        sel.appendChild(opt); 
    }
}

function solcCompile(compiler) {
    status("compiling...");
    SetLoader(true);
    document.getElementById("bytecode").value = "";
    document.getElementById("abi").value = "";

    var result = compiler.compile(getSourceCode(), optimize);
    var msg = "Compile error";
    for (let ch in result.contracts) {
        document.getElementById("bytecode").value = result.contracts[ch].bytecode;
        document.getElementById("abi").value = result.contracts[ch].interface;
        msg = "Compile Finished";
        break;
    }

    status(msg);
    SetLoader(false);
}

function loadSolcVersion() {

    status("Loading Soljson.");
    SetLoader(true);
    BrowserSolc.loadVersion(getVersion(), function(c) {
        compiler = c;
        status("Solc loaded");
        SetLoader(false);
    //    solcCompile(compiler);
    });
}

function onClickCompile() {
    if(compiler != undefined) {
        solcCompile(compiler);
    } else {
        loadSolcVersion();
        solcCompile(compiler);
    }
}

function SetLoader(isEnable) {
    if(isEnable) {
        document.getElementById("loader").style.display = "inline-block";
    } else {
        document.getElementById("loader").style.display = "none";
    }
}

window.onload = function() {
    document.getElementById("solSource").value = templateSource;
    document.getElementById("versions").onchange = loadSolcVersion;
    document.getElementById("btnCompile").onclick = onClickCompile;

    if (typeof BrowserSolc == 'undefined') {
        throw new Error();
    }

    status("Loading Compiler.");
    SetLoader(true);

    BrowserSolc.getVersions(function(soljsonSources, soljsonReleases) {
        listVersions(soljsonSources);
        document.getElementById("versions").value = soljsonReleases["0.4.24"];
        loadSolcVersion();
    });
};
