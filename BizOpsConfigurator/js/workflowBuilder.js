//functions & defaults for workflowBuilder
function workflowBuilderHandlers() {
    //menubar links
    $("#viewport").on("click", "#workflowAddSection", workflowAddSection);
    $("#viewport").on("click", "#workflowConfigButton", workflowConfiguration);
    $("#viewport").on("click", "#workflowTestButton", function (e) { });
    $("#viewport").on("click", "#workflowDownloadButton", workflowDownloader);
    $("#viewport").on("click", "#workflowUploadButton", workflowUploader);
    $("#viewport").on("click", "#workflowPageDown", function (e) { });
    $("#viewport").on("click", "#workflowPageNum", function (e) { });
    $("#viewport").on("click", "#workflowPageUp", function (e) { });
    $("#viewport").on("click", "#workflowPageAdd", function (e) { });
    $("#viewport").on("click", "#workflowPageDelete", function (e) { });

    //show/hide popups
    $("#viewport").on("focus", ".workflowSection", function () {
        $(this).find(".workflowSectionPopup").show();
    });
    $("#viewport").on("blur", ".workflowSection, .workflowSectionPopup", function (e) {
        closeIfFocusedElsewhere(e, ".workflowSectionPopup");
    });
    $("#viewport").on("focus", ".workflowInput", function (e) {
        $(this).find(".workflowInputPopup").show();
    });
    $("#viewport").on("blur", ".workflowInput, .workflowInputPopup", function (e) {
        closeIfFocusedElsewhere(e, ".workflowInputPopup");
    });

    //sectionpopup links
    $("#viewport").on("click", ".workflowSectionAddInput", workflowSectionAddInput);
    $("#viewport").on("click", ".workflowSectionDelete", function (e) {
        $(this).parents(".workflowSection").remove();
    });
    $("#viewport").on("click", ".workflowSectionUp", function (e) {
        let el = $(this).parents(".workflowSection");
        el.prev(".workflowSection").insertAfter(el);
    });
    $("#viewport").on("click", ".workflowSectionDown", function (e) {
        let el = $(this).parents(".workflowSection");
        el.next(".workflowSection").insertBefore(el);
    });

    //inputpopup links
    $("#viewport").on("click", ".workflowInputDelete", function (e) {
        $(this).parents(".workflowInput").remove();
    });
    $("#viewport").on("click", ".workflowInputUp", function (e) {
        let el = $(this).parents(".workflowInput");
        el.prev(".workflowInput").insertAfter(el);
    });
    $("#viewport").on("click", ".workflowInputDown", function (e) {
        let el = $(this).parents(".workflowInput");
        el.next(".workflowInput").insertBefore(el);
    });

    //newInput buttons
    $("#viewport").on("change", "#inputType", inputTypeChangeHandler);
    $("#viewport").on("change", "#commonQueries", commonQueryChangeHandler);
    $("#viewport").on("change", "#usqlCommonQueries", usqlCommonQueryChangeHandler);
    $("#viewport").on("change", "#multiple", multipleHandler);
    $("#viewport").on("click", "#testAPI", testAPIhandler);
    $("#viewport").on("click", "#testUSQL", testUSQLhandler);
    $("#viewport").on("click", "#staticBoxAdd", staticBoxAddHandler);
}

function workflowAddSection() {
    let sections = $("#workflowSections");
    let newSection = new Section();
    sections.append(newSection.html);
    $(".workflowSectionPopup, .workflowInputPopup").hide();
}

function workflowSectionAddInput() {
    let section = $(this).parents(".workflowSection");
    let newInput = new Input();
    let p = newInput.prompt();
    $.when(p).done(function (newInput) {
        section.append(newInput);
        $(".workflowSectionPopup, .workflowInputPopup").hide();
    });
}

function closeIfFocusedElsewhere(e, selector) {
    let from = $(e.currentTarget);
    let to = e.relatedTarget;
    if (from.has(to).length > 0) {
        return e; //still within
    } else {
        from.find(selector).delay(500).hide(); //outside, let's go
    }
}

function Section() {
    this.html = `
    <div class="workflowSection" tabindex="0">
        <div class="workflowSectionPopup">
            <div><a href="#workflowBuilder" class="workflowSectionAddInput">+</a></div>
            <div><a href="#workflowBuilder" class="workflowSectionDelete">❌</a></div>
            <div><a href="#workflowBuilder" class="workflowSectionUp">🔼</a></div>
            <div><a href="#workflowBuilder" class="workflowSectionDown">🔽</a></div>
        </div>
        <h3 contenteditable="true">Title</h3>
    </div>`;
}

function Input() {
    this.html = "";

    this.prompt = function () {
        let p0 = $.Deferred();
        let p1 = $.get("html/personaFlow/workflowBuilder-newInput.html");
        $.when(p1).done(function (content) {
            let p2 = popupHTMLDeferred("New Input", content);
            inputTypeChangeHandler();

            $.when(p2).done(function (data) {
                let input = "";
                switch (data.inputType) {
                    case "Text Input":
                        input = `<input class="workflowInput" placeholder="${data.placeholder}" value="${data.defaultvalue}" disabled>`;
                        break;
                    case "Select (API)":
                        input = `<select class="workflowSelect" disabled ${data.multiple}></select>
                        <input type="hidden" class="apiQuery" value="${data.apiQuery}">
                        <input type="hidden" class="apiResultSlicer" value="${data.apiResultSlicer}">
                        `;
                        break;
                    case "Select (USQL)":
                        input = `<select class="workflowSelect" disabled ${data.multiple}></select>
                        <input type="hidden" class="usqlQuery" value="${data.usqlQuery}">
                        <input type="hidden" class="usqlResultSlicer" value="${data.usqlResultSlicer}">
                        `;
                        break;
                    case "Select (static)":
                        input = `<select class="workflowSelect" data-options='${data.staticOptions}' disabled ${data.multiple}></select>
                        `;
                        break;
                    case "Funnel":
                        input = `<h1>Giant funnel graphic here</h1>`;
                        break;
                    case "Checkboxes":
                        input = `<input class="workflowCheck" type="checkbox" placeholder="Friendly Name" disabled>
                        <input type="hidden" class="apiQuery" value="${data.apiQuery}">`;
                        break;
                }

                this.html = `
                <div class="workflowInput" tabindex="0">
                    <div class="workflowInputPopup">
                        <div><a href="#workflowBuilder" class="workflowInputDelete">❌</a></div>
                        <div><a href="#workflowBuilder" class="workflowInputUp">🔼</a></div>
                        <div><a href="#workflowBuilder" class="workflowInputDown">🔽</a></div>
                    </div>
                    <div class="inputHeader" contenteditable="true">New Header</div>
                    <div class="userInput">${input}</div>
                    <div class="transform">&dollar;{<span contenteditable="true">${data.transform}</span>}</div>
                </div>`
                p0.resolve(this.html);
            });
        });
        return p0;
    }
}

function inputTypeChangeHandler() {
    $("#apiQueryBox").hide();
    $("#usqlQueryBox").hide();
    $("#newInputResult").hide();
    $("#newInputPreview").hide();
    $("#staticBox").hide();
    $("#multiBox").hide();
    $("#apiQueryHeader").text();
    $("#preview").html();

    switch ($("#inputType").val()) {
        case "Text Input":
            break;
        case "Select (API)":
            $("#apiQueryBox").show();
            $("#newInputResult").show();
            $("#newInputPreview").show();
            $("#multiBox").show();
            break;
        case "Select (USQL)":
            $("#usqlQueryBox").show();
            $("#newInputResult").show();
            $("#newInputPreview").show();
            $("#multiBox").show();
            break;
        case "Select (static)":
            $("#staticBox").show();
            let html = `<select id="staticPreview"></select>`;
            $("#newInputPreview").html(html);
            $("#newInputPreview").show();
            $("#multiBox").show();
            break;
        case "Checkboxes":
            break;
        case "KUA Funnel":
            break;
    }
}

function commonQueryChangeHandler() {
    let commonQueries = $("#commonQueries").val();

    switch (commonQueries) {
        case "Apps":
            $("#apiQuery").val("/api/v1/entity/applications?includeDetails=false");
            $("#apiResultSlicer").val("{entityId:displayName}");
            break;
        case "MZs":
            $("#apiQuery").val("/api/config/v1/managementZones");
            $("#apiResultSlicer").val("values:{id:name}");
            break;
        case "Hosts":
            $("#apiQuery").val("/api/v1/entity/infrastructure/hosts?includeDetails=true");
            $("#apiResultSlicer").val("{entityId:displayName}");
            break;
        case "Autotags":
            $("#apiQuery").val("/api/config/v1/autoTags");
            $("#apiResultSlicer").val("values:{id:name}");
            break;
        case "Services":
            $("#apiQuery").val("/api/v1/entity/services?includeDetails=false");
            $("#apiResultSlicer").val("{entityId:displayName}");
            break;

    }
}

function usqlCommonQueryChangeHandler() {
    let commonQueries = $("#usqlCommonQueries").val();

    switch (commonQueries) {
        case "Double/Long USPs":
            $("#usqlQuery").val('SELECT usersession.longProperties, usersession.doubleProperties FROM useraction WHERE useraction.application = "${app}" LIMIT 5000');
            $("#usqlResultSlicer").val("Keys");
            break;
        case "String/Date USPs":
            $("#usqlQuery").val('SELECT usersession.stringProperties, usersession.dateProperties FROM useraction WHERE useraction.application = "${app}" LIMIT 5000');
            $("#usqlResultSlicer").val("Keys/Values");
            break;
        case "Regions":
            $("#usqlQuery").val('SELECT DISTINCT country, region, city FROM usersession WHERE useraction.application = "${app}" ORDER BY country,region,city LIMIT 5000');
            $("#usqlResultSlicer").val("ValX3");
            break;
    }
}

function testAPIhandler() {
    let p0 = getConnectInfo();

    $.when(p0).done(function () {
        let query = $("#apiQuery").val();
        let p = dtAPIquery(query);
        $.when(p).done(function (data) {
            jsonviewer(data, true, "", "#apiResult");
            $("#apiQueryHeader").text(query);
            let parsedResults = [];
            let apiResultSlicer = $("#apiResultSlicer").val();
            switch (apiResultSlicer) {
                case "{entityId:displayName}":
                    if (data.length > 0) data.forEach(function (item) {
                        parsedResults.push({ id: item.entityId, value: item.displayName });
                    });
                    break;
                case "values:{id:name}":
                    if (typeof data.values == "object") data.values.forEach(function (item) {
                        parsedResults.push({ id: item.id, value: item.name });
                    });
                    break;
            }
            let previewHTML = "";
            let inputType = $("#inputType").val();
            let multiple = $("#multiple").prop("checked") ? "multiple" : "";
            if (parsedResults.length > 0) switch (inputType) {
                case "Select (API)":
                    previewHTML = `<select ${multiple}>`;
                    parsedResults.forEach(function (i) {
                        previewHTML += `<option id="${i.id}">${i.value}</option>`;
                    });
                    previewHTML += `</select>`;
                    break;
            }
            $("#preview").html(previewHTML);
        });
    });
}

function testUSQLhandler() {
    let p0 = getConnectInfo();

    $.when(p0).done(function () {
        let p1 = getTestApp();

        $.when(p1).done(function (appName) {
            let usql = $("#usqlQuery").val();
            usql = usql.replace("${app}", appName);
            let query = "/api/v1/userSessionQueryLanguage/table?query=" + encodeURIComponent(usql) + "&explain=false";
            let p2 = dtAPIquery(query);
            $.when(p2).done(function (data) {
                jsonviewer(data, true, "", "#apiResult");
                $("#apiQueryHeader").text(query);
                let parsedResults = [];
                let apiResultSlicer = $("#usqlResultSlicer").val();
                let previewHTML = "";
                switch (apiResultSlicer) {
                    case 'parseUSPFilter':
                        parsedResults = parseUSPFilter(data);
                        break;
                    case 'Keys/Values':
                        parsedResults = parseUSPFilter(data);
                        previewHTML = `
                        <div class="inputHeader">Keys:</div>
                        <div class="userInput"><select id="uspKey" class="uspFilter"></select></div>
                        <div class="inputHeader">Values:</div>
                        <div class="userInput"><select id="uspVal" class="uspFilter"></select>
                        `;
                        $("#preview").html(previewHTML);
                        uspFilterChangeHandler();
                        break;
                    case 'Keys':
                        parsedResults = parseUSPFilter(data);
                        previewHTML = `
                        <div class="inputHeader">Keys:</div>
                        <div class="userInput"><select id="uspKey" class="uspFilter"></select></div>
                        `;
                        $("#preview").html(previewHTML);
                        uspFilterChangeHandler();
                        break;
                    case 'ValX3':
                        parsedResults = parseRegions(data);
                        previewHTML = `
                        <div class="inputHeader">Values:</div>
                        <div class="userInput"><select id="countryList" class="regionFilter"></select></div>
                        <div class="inputHeader">Values:</div>
                        <div class="userInput"><select id="regionList" class="regionFilter"></select></div>
                        <div class="inputHeader">Values:</div>
                        <div class="userInput"><select id="cityList" class="regionFilter"></select></div>
                        `;
                        $("#preview").html(previewHTML);
                        regionsChangeHandler();
                        break;
                }
            });
        });
    });
}

function staticBoxAddHandler() {
    let key = $("#staticBoxLabel").val();
    let val = $("#staticBoxValue").val();

    let el = $(`<option value="${val}">${key}</option>`);
    el.appendTo("#staticPreview");
    $("#staticPreview").val(val);
    $("#staticBoxLabel").val("");
    $("#staticBoxValue").val("");

    let vals = $("#staticOptions").val();
    if (vals.length < 1) vals = "[]";
    let staticOptions = JSON.parse(vals);
    let newOption = {};
    newOption[key] = val;
    staticOptions.push(newOption);
    $("#staticOptions").val(JSON.stringify(staticOptions));
}

function multipleHandler() {
    let multiple = $("#multiple").prop("checked") ? "multiple" : "";
    $("#multiple").val(multiple);
}

function workflowDownloader() {
    let workflow = {};
    workflow['html'] = $("#workflow").prop("outerHTML");
    let config = $("#workflowConfigJSON").val();
    if(config.length>0) workflow['config'] = JSON.parse(config);
    let filename = `workflowname.cwf.json`;
    let text = JSON.stringify(workflow);

    download(filename, text);
}

function workflowConfiguration() {
    let p0 = $.Deferred();
    let oldConfigVal = $("#workflowConfigJSON").val();
    let oldConfig = {};
    if(oldConfigVal.length>0) oldConfig = JSON.parse(oldConfigVal);

    let p1 = $.get("html/personaFlow/workflowBuilder-config.html");
    $.when(p1).done(function (content) {
        let p2 = popupHTMLDeferred("Workflow Configuration", content);
        let html = "";
        personas.forEach(function (e) {
            html += `<option>${e}</option>`;
        })
        $("#persona").html(html);

        html = "";
        usecases.forEach(function (e) {
            html += `<option>${e.name}</option>`;
        });
        $("#usecase").html(html);

        for(const prop in oldConfig) {
            if(prop.length>0) { //handle empty string props
                $(`#${prop}`).val(oldConfig[prop]);
            }
        }

        $.when(p2).done(function(data){
            let newConfig = JSON.stringify(data);
            $("#workflowConfigJSON").val(newConfig);
            p0.resolve();
        })
    });
}

function workflowUploader() {
    let p0 = $.Deferred();

    /*let p1 = $.get("html/personaFlow/workflowBuilder-upload.html");
    $.when(p1).done(function (content) {
        let p2 = popupHTMLDeferred("Workflow Upload", content, uploadFileGetter);
        
        $.when(p2).done(function(data){
            let newConfig = JSON.stringify(data);
            $("#workflowConfigJSON").val(newConfig);
            p0.resolve();
        })
    });*/
        //get file from a popup
        let popupHeader = "Workflow to upload";
        let inputs = [{ type: 'file', name: 'workflowFile', value: '', label: "JSON&nbsp;file" }];
        let desc = "Downloaded from an online environment.";

        let popup_p = popup(inputs, popupHeader, desc);
        $.when(popup_p).done(function (data) {
          let file = data.find(obj => obj.name == "workflowFile").file;
          fr = new FileReader();
          fr.onload = function () {
            let res = fr.result;
            let json = JSON.parse(res);

          };
          if (typeof file !== "undefined") fr.readAsText(file);
        });
}