function loadInputChangeHandlers() {
  $("#viewport").on("change", "#compareAppList", compareAppChangeHandler);
  $("#viewport").on("change", "#compareAppList1, #compareAppList2", xappCompareAppChangeHandler);
  $("#viewport").on("change", "#usplist", uspListChangeHandler);
  $("#viewport").on("change", "#campaignActive", campaignChangeHandler);
  $("#viewport").on("change", "#featureAdded", featureChangeHandler);
  $("#viewport").on("change", "#authgithub", authgithubChangeHandler);
  $("#viewport").on("change", "#MyTime", MyTimeChangeHandler);
  $("#viewport").on("change", ".uspFilter", uspFilterChangeHandler);
  $("#viewport").on("change", ".regionFilter", regionsChangeHandler);
  $("#viewport").on("change", "#xapp", xappChangeHandler);
  $("#viewport").on("change", "#appOverview", appOverviewChangeHandler);
  $("#viewport").on("change", "#tenantOverview", tenantOverviewChangeHandler);
  $("#viewport").on("change", ".rfc1918", rfc1918ChangeHandler);
  $("#viewport").on("change", ".dashboardCleanupAll", dashboardCleanupAllChangeHandler);
  $("#viewport").on("change", "#HU-report", HUreportChangeHandler);

  $("#viewport").on("click", "section h4", helpdocToggler);
}


//////////////////////////////////////////////

function compareAppChangeHandler(e) {
  $("#compareFirstStep").html("");
  $("#compareLastStep").html("");
  $("#compareRevenue").html("");
  let compareApp = $("#compareAppList option:selected").text();

  if (compareApp != "None") {
    let p1 = getKeyActions(compareApp);
    let p2 = getKPIs(compareApp);

    return $.when(p1, p2).done(function (d1, d2) {
      let KAs = parseSteps(d1[0]);
      let kpis = parseKPIs(d2[0]);
      let KAlist = "";
      let KPIlist = "";

      if (KAs.steps.length > 0) KAs.steps.forEach(function (ka) {
        KAlist += "<option value='" + ka.step + "' data-colname='" + KAs.type + "'>" + ka.step + "</option>";
      });
      if (kpis.length > 0) kpis.forEach(function (kpi) {
        KPIlist += "<option value='" + kpi.type + "." + kpi.key + "'>" + kpi.key + "</option>";
      });
      $("#compareFirstStep").append(KAlist);
      $("#compareLastStep").append(KAlist);
      $("#compareRevenue").append(KPIlist);
      $(".compareApp").show();
    });
  } else {
    $(".compareApp").hide();
  }
}

function xappCompareAppChangeHandler(e) {
  $("#xapp_compareFirstStep").html("");
  $("#xapp_compareLastStep").html("");
  $("#xapp_compareRevenue").html("");
  let compareApp1 = $("#compareAppList1 option:selected").text();
  let compareApp2 = $("#compareAppList2 option:selected").text();

  if (compareApp1 != "None" && compareApp2 != "None") {
    let p1 = getKeyActions(compareApp1);
    let p2 = getKPIs([compareApp1, compareApp2]);
    let p3 = getKeyActions(compareApp2);

    return $.when(p1, p2, p3).done(function (d1, d2, d3) {
      let KAs1 = parseSteps(d1[0]);
      let KAs2 = parseSteps(d3[0]);
      let kpis = parseKPIs(d2[0]);
      let KAlist1 = "";
      let KAlist2 = "";
      let KPIlist = "";

      if (KAs1.steps.length > 0) KAs1.steps.forEach(function (ka) {
        KAlist1 += "<option value='" + ka.step + "' data-colname='" + KAs1.type + "'>" + ka.step + "</option>";
      });
      if (KAs2.steps.length > 0) KAs2.steps.forEach(function (ka) {
        KAlist2 += "<option value='" + ka.step + "' data-colname='" + KAs2.type + "'>" + ka.step + "</option>";
      });
      if (kpis.length > 0) kpis.forEach(function (kpi) {
        KPIlist += "<option value='" + kpi.type + "." + kpi.key + "'>" + kpi.key + "</option>";
      });
      $("#xapp_compareFirstStep").append(KAlist1);
      $("#xapp_compareLastStep").append(KAlist2);
      $("#xapp_compareRevenue").append(KPIlist);
      $(".xapp_compare").show();
    });
  } else {
    $(".xapp_compare").hide();
  }
}

function uspListChangeHandler(e) {
  if ($("#usplist").val() == "n/a")
    $("#kpiName").hide();
  else
    $("#kpiName").show();
}

function campaignChangeHandler(e) {
  if ($("#campaignActive").prop('checked') == true) {
    let p1 = getKeyActions(selection.config.appName);
    return $.when(p1).done(function (d1) {
      let KAs = parseKeyActions(d1);
      let KAlist = "";
      if (KAs.goals.length > 0) KAs.goals.forEach(function (ka) {
        KAlist += "<option value='" + ka + "' data-colname='" + KAs.type + "'>" + ka + "</option>";
      });
      $("#campaignStep1").html(KAlist);
      $(".campaignActive").show();
    });
  } else {
    $(".campaignActive").hide();
  }
}

function featureChangeHandler(e) {
  if ($("#featureAdded").prop('checked') == true) {
    let p1 = getKeyActions(selection.config.appName);
    return $.when(p1).done(function (d1) {
      let KAs = parseKeyActions(d1);
      let KAlist = "";
      if (KAs.goals.length > 0) KAs.goals.forEach(function (ka) {
        KAlist += "<option value='" + ka + "' data-colname='" + KAs.type + "'>" + ka + "</option>";
      });
      $("#StepNewFeature1").html(KAlist);
      $(".featureAdded").show();
    });
  } else {
    $(".featureAdded").hide();
  }
}

function authgithubChangeHandler() {
  if ($("#authgithub").prop('checked') == true) {
    $("tr.github").show();
  } else {
    $("tr.github").hide();
  }
}

function MyTimeChangeHandler() {
  selection.config.MyTime = $("#MyTime").val();
  let compareTimeList = "";

  timeTable.forEach(function (t) {
    if (t.MyTime == selection.config.MyTime) {
      t.MyCompareTimes.forEach(function (ct) {
        compareTimeList += "<option value='" + ct + "'>" + ct + "</option>";
      });
    }
  });
  $("#compareTimeList").html(compareTimeList);
  if ("compareTime" in selection.config && selection.config.compareTime > "")
    $("#compareTimeList").val(selection.config.compareTime);
  else
    $("#compareTimeList option:first").attr('selected', 'selected');
}

function regionsChangeHandler() {
  let countryOs = "<option value''></option>";
  let regionOs = "<option value''></option>";
  let cityOs = "<option value''></option>";
  let country = $("#countryList").val();
  let region = $("#regionList").val();
  let city = $("#cityList").val();

  if (typeof selection.config.filterData != "undefined") {
    if (country == "") country = selection.config.filterData.country;
    if (region == "") region = selection.config.filterData.region;
    if (city == "") city = selection.config.filterData.city;
  }

  let countries = [...new Set(Regions.map(x => x.country))];
  countries.forEach(function (c) {
    countryOs += "<option value='" + c + "'>" + c + "</option>";
  });
  $("#countryList").html(countryOs);

  //determine regions
  if (country != '') {
    $("#countryList").val(country);
    let map = new Map();
    for (let i of Regions) {
      if (!map.has(i.region) && i.country == country) {
        map.set(i.region, true);
        regionOs += "<option value='" + i.region + "'>" + i.region + "</option>";
      }
    }
    $("#regionList").html(regionOs);
    $("#regionList").show();
  } else $("#regionList").hide();

  //determine cities
  if (region != '') {
    $("#regionList").val(region);
    let map = new Map();
    for (let i of Regions) {
      if (!map.has(i.city) && i.country == country && i.region == region) {
        map.set(i.city, true);
        cityOs += "<option value='" + i.city + "'>" + i.city + "</option>";
      }
    }
    $("#cityList").html(cityOs);
    $("#cityList").show();
  } else $("#cityList").hide();

  if (city != '') {
    $("#cityList").val(city);
  }
  $("#filterClause").val(buildFilterClause());
}

function uspFilterChangeHandler() {
  let keyOs = "<option value''></option>";
  let valOs = "<option value''></option>";
  let key = $("#uspKey").val();
  let type = (($("#uspKey option:selected").length > 0) ?
    $("#uspKey option:selected")[0].dataset['colname'] :
    undefined);
  let val = $("#uspVal").val();

  if (typeof key == "undefined" || key == null || key == '') { //build out key list if needed
    Object.keys(USPs).forEach(function (t) {
      Object.keys(USPs[t]).forEach(function (k) {
        keyOs += "<option value='" + k + "' data-colname='" + t + "'>" + k + "</option>";
      });
    });
    $("#uspKey").html(keyOs);
    $("#uspVal").hide();
  }

  if (typeof selection.config.filterData != "undefined") { //load config if available
    if (val == "") val = selection.config.filterData.val;
    if (type == "") type = selection.config.filterData.type;
    if (key == "") key = selection.config.filterData.key;
    if (type != "") $("#uspKey").attr('data-colname', type);
    if (key != "") $("#uspKey").val(key);
  }

  if (key != "") {  //if we have the key draw the values
    if (typeof USPs[type] != "undefined" &&
      typeof USPs[type][key] != "undefined")
      USPs[type][key].forEach(function (v) {
        valOs += "<option value='" + v + "'>" + v + "</option>";
      });
    $("#uspVal").html(valOs);
    $("#uspVal").show();
    if (val != '') $("#uspVal").val(val);
  }

  $("#filterClause").val(buildFilterClause());
}

function xappChangeHandler() {
  var p1 = {};
  if ($("#xapp").prop('checked')) {
    p1 = getApps();
    $.when(p1).done(function (d1) {
      let apps = d1;
      let apps_html = "";
      apps.sort((a, b) => (a.displayName.toLowerCase() > b.displayName.toLowerCase()) ? 1 : -1);
      apps.forEach(function (app) {
        apps_html += "<option value='" + app.displayName + "' data_id='" + app.entityId + "'>" + app.displayName + "</option>";
      });
      $("#xapp_apps").html(apps_html);
      $(".xapps").show();
      //if("appID" in config)$("#xapp_apps").val(config.appID); //figure out how to set multiple values
    });
  }
  else
    $(".xapps").hide();

  return p1;
}

function appOverviewChangeHandler() {
  var AO = $("#appOverview").val();

  $("#autoTag").hide();
  $("#compareApp").hide();
  $("#compareTime").hide();
  $("#remoteEmployeeInputs").hide();
  $(".remoteEmployeeCompare").hide();
  $("#citrixAppTemplate").hide();
  $("#appPickerLabel").text("App");

  let readme = findOverviewREADME(AO);
  if (typeof readme != "undefined") $("#readmeIcon").show();
  else $("#readmeIcon").hide();

  switch (AO) {
    case "AppOverview.json": {
      $("#compareApp").show();
      $("#compareTime").show();
      break;
    }
    case "CitrixOverview.json": {
      $("#appPickerLabel").text("StoreFront App");
      $("#citrixAppTemplate").show();
      drawMZs("#citrixMZ");
      $("#citrixMZ").on("change", "", function () {
        let mzid = $(this).val();
        getServices(mzid).then(function (services) {
          drawServiceSelect(services, "#storefrontService");
        });
        getApps(mzid).then(function (apps) {
          drawApps(apps, selection.config, selector = "#citrixRUMApp");
        });
      });
      break;
    }
    case "REApplicationOverview.json":
    case "REApplicationOverview2.json": {
      $("#remoteEmployeeInputs").show();
      $(".remoteEmployeeCompare").show();
      break;
    }
    default:
      console.log("No special handling defined for #appOverview: " + AO);
  }
}

function tenantOverviewChangeHandler() {
  var TO = $("#tenantOverview").val();

  $("#remoteEmployeeInputs").hide();
  $(".remoteEmployeeCompare").hide();
  $("#SAPtenant").hide();

  let readme = findOverviewREADME(TO);
  if (typeof readme != "undefined") $("#readmeIcon").show();
  else $("#readmeIcon").hide();

  switch (TO) {
    case "RETenantOverview.json":
    case "RETenantOverview2.json":
    case "RETenantOverview3.json": {
      $("#remoteEmployeeInputs").show();
      $(".remoteEmployeeCompare").show();
      break;
    }
    case "00000000-dddd-bbbb-ffff-000000000001":
    case "TenantOverview.json": {
      break;
    }
    case "SAP Application Cockpit.json": {
      $("#SAPtenant").show();
      getApps().then(function (apps) {
        let customapps = apps.filter(app => app.entityId.includes("CUSTOM_APPLICATION"));
        let html = "";
        customapps.forEach(function (app) {
          html += `<option value='${JSON.stringify(app)}'>${app.displayName}</option>`;
        });
        $("#SAPapps").html(html);
      });
      break;
    }
    default:
      console.log("No special handling defined for #tenantOverview: " + TO);
  }
}

function rfc1918ChangeHandler() {
  let ipClauseObj = $(this).parent("div").find(".ipClause");
  let ipClause = ipClauseObj.val();
  let ipClauses = [];
  try {
    ipClause = ipClause.match(/\((.*)\)/)[1];
    ipClauses = ipClause.split(" OR ");
  } catch (e) {
    ipClause = "";
    ipClauses = [];
  }

  if ($(this).prop("checked")) {
    if (!ipClause.includes("10.0.0.0"))
      ipClauses.push(`usersession.ip BETWEEN "10.0.0.0" AND "10.255.255.255"`);
    if (!ipClause.includes("172.16.0.0"))
      ipClauses.push(`usersession.ip BETWEEN "172.16.0.0" AND "172.31.255.255"`);
    if (!ipClause.includes("192.168.0.0"))
      ipClauses.push(`usersession.ip BETWEEN "192.168.0.0" AND "192.168.255.255"`);
    if (ipClauses.length > 0) ipClause = ` AND (${ipClauses.join(" OR ")})`;
    else ipClause = "";
    ipClauseObj.val(ipClause);
  } else {
    let i = 0;
    i = ipClauses.indexOf(`usersession.ip BETWEEN "10.0.0.0" AND "10.255.255.255"`);
    if (i > -1) ipClauses.splice(i, 1);
    i = ipClauses.indexOf(`usersession.ip BETWEEN "172.16.0.0" AND "172.31.255.255"`);
    if (i > -1) ipClauses.splice(i, 1);
    i = ipClauses.indexOf(`usersession.ip BETWEEN "192.168.0.0" AND "192.168.255.255"`);
    if (i > -1) ipClauses.splice(i, 1);
    if (ipClauses.length > 0) ipClause = ` AND (${ipClauses.join(" OR ")})`;
    else ipClause = "";
    ipClauseObj.val(ipClause);
  }
}

function dashboardCleanupAllChangeHandler() {
  let checked = $(this).prop("checked");
  let parent = $(this).parent();

  if (checked) {
    parent.find("ul li input[type=checkbox]").each(function (i) {
      $(this).prop("checked", true);
    });
  } else {
    parent.find("ul li input[type=checkbox]").each(function (i) {
      $(this).prop("checked", false);
    });
  }
}

function HUreportChangeHandler() {
  let report = $("#HU-report").val();
  let urlObj = $("#url");
  let tokenObj = $("#token");

  if (urlObj.val() == "" && url !== "") { urlObj.val(url); }
  if (tokenObj.val() == "" && token !== "") { tokenObj.val(token); }

  if (urlObj.val() == "" || tokenObj.val() == "") {
    $("#HU-infobox").text("Please enter a URL and Token first");
  } else {
    url = urlObj.val();
    if (url.length > 1 && url.charAt(url.length - 1) == "/")
      url = url.substring(0, url.length - 1);
    token = tokenObj.val();
    let p = $.Deferred();
    if (HUreport.url == url) p.resolve(HUreport.data);
    else p = getHosts();

    $("#HU-total").html("");
    $("#HU-HostGroup").html("");
    $("#HU-MZ").html("");
    $("#HUreport h3").text("");
    $("#HU-infobox").text("");

    $.when(p).done(function (data) {
      HUreport.url = url;
      HUreport.data = data; //save for later

      let today = data
        .filter(h => h.lastSeenTimestamp > Date.now() - (1000 * 60 * 60)); //seen last hour
      let newThisWeek = data
        .filter(h => h.firstSeenTimestamp > Date.now() - (1000 * 60 * 60 * 24 * 7));
      let removedLast72 = data
        .filter(h => h.lastSeenTimestamp < Date.now() - (1000 * 60 * 60)) //not seen last hour

      switch (report) {
        case "Total": {
          let todayHU = today
            .reduce((a, cv) => a + cv.consumedHostUnits, 0);
          let newThisWeekHU = newThisWeek
            .reduce((a, cv) => a + cv.consumedHostUnits, 0);
          let removedLast72HU = removedLast72
            .reduce((a, cv) => a + cv.consumedHostUnits, 0);

          $("#HUreport h3").text("HostUnit Totals");
          let html = "<table class='dataTable'>";
          html += `<tr><td>Total HU:</td><td>${todayHU.toFixed(2)}</td></tr>`;
          html += `<tr><td>New HU this week:</td><td>${newThisWeekHU.toFixed(2)}</td></tr>`;
          html += `<tr><td>HU removed last 72h:</td><td>${removedLast72HU.toFixed(2)}</td></tr>`;
          html += "</table><a href='#downloadExcel' id='downloadExcel' data-tableid='#HU-total table' data-filename='HUreport-HU-total'><img src='images/folder.svg'></a>";
          $("#HU-total").html(html);
          break;
        }
        case "HostGroup": {
          $("#HUreport h3").text("HostUnits per HostGroup");
          let hostgroups = new Map();
          data.forEach(function (h) {
            let hg = " ";
            if ("hostGroup" in h) hg = h.hostGroup.name;
            console.log(`first:${h.firstSeenTimestamp},last:${h.lastSeenTimestamp},lasthour:${h.lastSeenTimestamp - (Date.now() - (1000 * 60 * 60))},new:${h.firstSeenTimestamp - (Date.now() - (1000 * 60 * 60 * 24 * 7))},removed:${(Date.now() - (1000 * 60 * 60)) - h.lastSeenTimestamp}`);
            if (hostgroups.has(hg)) {
              let hu = hostgroups.get(hg);
              if (h.lastSeenTimestamp > (Date.now() - (1000 * 60 * 60)))//last hour
                hu.todayHU = hu.todayHU + h.consumedHostUnits;
              if (h.firstSeenTimestamp > (Date.now() - (1000 * 60 * 60 * 24 * 7)))
                hu.newThisWeekHU = hu.newThisWeekHU + h.consumedHostUnits;
              if (h.lastSeenTimestamp < (Date.now() - (1000 * 60 * 60)))//not seen last hour
                hu.removedLast72HU = hu.removedLast72HU + h.consumedHostUnits;
              hostgroups.set(hg, hu);
            } else {
              let hu = { todayHU: 0, newThisWeekHU: 0, removedLast72HU: 0 };
              if (h.lastSeenTimestamp > (Date.now() - (1000 * 60 * 60)))//last hour
                hu.todayHU = h.consumedHostUnits;
              if (h.firstSeenTimestamp > (Date.now() - (1000 * 60 * 60 * 24 * 7)))
                hu.newThisWeekHU = h.consumedHostUnits;
              if (h.lastSeenTimestamp < (Date.now() - (1000 * 60 * 60)))//not seen last hour
                hu.removedLast72HU = h.consumedHostUnits;
              hostgroups.set(hg, hu);
            }
          });

          //sort descending
          hostgroups[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1].todayHU - a[1].todayHU);
          }

          let todayHUTotal = 0;
          let newThisWeekHUTotal = 0;
          let removedLast72HUTotal = 0;

          let html = "<table class='dataTable'>";
          html += `<thead><tr><td>HostGroup</td><td>HU Today</td><td>New This Week</td><td>Removed Last 72hr</td></tr></thead><tbody>`;
          for (let [k, v] of hostgroups) {
            html += `<tr><td>${k}</td><td>${v.todayHU.toFixed(2)}</td><td>${v.newThisWeekHU.toFixed(2)}</td><td>${v.removedLast72HU.toFixed(2)}</td></tr>`;
            todayHUTotal += v.todayHU;
            newThisWeekHUTotal += v.newThisWeekHU;
            removedLast72HUTotal += v.removedLast72HU;
          }

          html += `</tbody><tfoot><tr><td>Total:</td><td>${todayHUTotal.toFixed(2)}</td><td>${newThisWeekHUTotal.toFixed(2)}</td><td>${removedLast72HUTotal.toFixed(2)}</td></tr></tfoot>`;
          html += "</table><a href='#downloadExcel' id='downloadExcel' data-tableid='#HU-HostGroup table' data-filename='HUreport-HU-HostGroup'><img src='images/folder.svg'></a>";

          $("#HU-HostGroup").html(html);
          break;
        }
        case "ManagementZone": {
          $("#HUreport h3").text("HostUnit per MZ");
          $("#HU-infobox").text("Note: hosts can and usually are in more than one MZ");

          let mzs = new Map();
          data.forEach(function (h) {
            if ("managementZones" in h) h.managementZones.forEach(function (mz) {
              if (mzs.has(mz.name)) {
                let hu = mzs.get(mz.name);
                if (h.lastSeenTimestamp > (Date.now() - (1000 * 60 * 60)))//last hour
                  hu.todayHU = hu.todayHU + h.consumedHostUnits;
                if (h.firstSeenTimestamp > (Date.now() - (1000 * 60 * 60 * 24 * 7)))
                  hu.newThisWeekHU = hu.newThisWeekHU + h.consumedHostUnits;
                if (h.lastSeenTimestamp < (Date.now() - (1000 * 60 * 60)))//not seen last hour
                  hu.removedLast72HU = hu.removedLast72HU + h.consumedHostUnits;
                mzs.set(mz.name, hu);
              } else {
                let hu = { todayHU: 0, newThisWeekHU: 0, removedLast72HU: 0 };
                if (h.lastSeenTimestamp > (Date.now() - (1000 * 60 * 60)))//last hour
                  hu.todayHU = h.consumedHostUnits;
                if (h.firstSeenTimestamp > (Date.now() - (1000 * 60 * 60 * 24 * 7)))
                  hu.newThisWeekHU = h.consumedHostUnits;
                if (h.lastSeenTimestamp < (Date.now() - (1000 * 60 * 60)))//not seen last hour
                  hu.removedLast72HU = h.consumedHostUnits;
                mzs.set(mz.name, hu);
              }
            });
          });

          //sort descending
          mzs[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1].todayHU - a[1].todayHU);
          }

          let todayHUTotal = 0;
          let newThisWeekHUTotal = 0;
          let removedLast72HUTotal = 0;

          let html = "<table class='dataTable'>";
          html += `<thead><tr><td>ManagementZones</td><td>HU Today</td><td>New This Week</td><td>Removed Last 72hr</td></tr></thead><tbody>`;
          for (let [k, v] of mzs) {
            html += `<tr><td>${k}</td><td>${v.todayHU.toFixed(2)}</td><td>${v.newThisWeekHU.toFixed(2)}</td><td>${v.removedLast72HU.toFixed(2)}</td></tr>`;
            todayHUTotal += v.todayHU;
            newThisWeekHUTotal += v.newThisWeekHU;
            removedLast72HUTotal += v.removedLast72HU;
          }

          html += `</tbody><tfoot><tr><td>Total:</td><td>${todayHUTotal.toFixed(2)}</td><td>${newThisWeekHUTotal.toFixed(2)}</td><td>${removedLast72HUTotal.toFixed(2)}</td></tr></tfoot>`;
          html += "</table><a href='#downloadExcel' id='downloadExcel' data-tableid='#HU-MZ table' data-filename='HUreport-MZ'><img src='images/folder.svg'></a>";
          $("#HU-MZ").html(html);
          break;
        }
      }
    });
  }
}

