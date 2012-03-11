var pageName;

function fillPrintDetails(selectId, outputId)
{
	var sourceId = document.getElementById(selectId);
	var targetId = document.getElementById(outputId);
	var strDelimeter = ", ";
	var outputValue = "";

	if ((sourceId != null) && (targetId != null))
	{
		for (i = 0; i < sourceId.options.length; ++i)
		{
			if (sourceId.options[i].selected)
				outputValue += strDelimeter + sourceId.options[i].text;
 			}

		if (outputValue.length > 0)
			outputValue = outputValue.substring(2);

		targetId.innerHTML = outputValue;
	}

}

var data_form_id = 'data_form';

/**
 * Nastavljanje predogleda za printanje.
 * Trenutno se kar direkt izvede printanje
 * 
 * @return
 */
function printPreview()
{
	printSchedule();
}

function printSchedule()
{
	window.print();
}

function checkWhatToPrint()
{
	var withGroups = document.getElementById("with_groups");
	var groupSelector = document.getElementById("groups_selector");
	var printSelectionDetails = document.getElementById("print_selection_details");
	var showLastChange = document.getElementById("show_lastchange");
	var showWeekNumber = document.getElementById("show_week_number");

	if ((printSelectionDetails == null) || (printSelectionDetails.value != "1"))
	{
		document.getElementById("selectionDetails").style.display = 'none';
		return;
	}

	if (pageName == "groups")
	{
		if ((withGroups != null) && (withGroups.value == "1") && (groupSelector != null) && (groupSelector.value == "1"))
			document.getElementById("printGroupRow").style.display = '';
		else
			document.getElementById("printGroupRow").style.display = 'none';
	}
}

function fillPrintData()
{
	switch (pageName)
	{
		case "groups":
			fillPrintDetails("program", "printProgramName");
			fillPrintDetails("branch", "printBranch");
			fillPrintDetails("group", "printGroup");
           	fillPrintDetails("year", "printYear");
			break;

		case "classrooms":
			fillPrintDetails("room", "printClassroomName");
			break;

		case "courses":
			fillPrintDetails("program", "printProgramName");
			fillPrintDetails("branch", "printBranch");
			fillPrintDetails("courses", "printCourses");
			fillPrintDetails("year", "printYear");
			break;

		case "classrooms":
			fillPrintDetails("prof", "printProf");
			break;

		case "prof":
			fillPrintDetails("prof", "printProf");
			break;

		case "stud":
			//fillPrintDetails("in_number", "printRegNumber");
			break;
	}

}

function onLoad()
{
	pageName = ((document.getElementById("pagename") == null) ||
				(document.getElementById("pagename").value.length == 0)) ?
				"undefined" : document.getElementById("pagename").value;

	// Top row
	var customMessage = document.getElementById("customMessage");
	if ((customMessage != null) && (customMessage.innerHTML.length == 0))
		customMessage.style.display = 'none';

	var adminError = document.getElementById("adminError");
	if ((adminError != null) && (adminError.innerHTML.length == 0))
		adminError.style.display = 'none';


	if (pageName == "undefined") return;

	// Print details block (only for known pages, i.e. pageName != "undefined"

	var printSelectionDetails = document.getElementById("print_selection_details");
	var showLastChange = document.getElementById("show_lastchange");
	var showWeekNumber = document.getElementById("show_week_number");
	var printDetailsRow = document.getElementById("printDetailsRow");
	var printDetailsRowSpacer = document.getElementById("printDetailsRowSpacer");

	if (((printSelectionDetails == null) || (printSelectionDetails.value != "1")) &&
		((showLastChange == null) || (showLastChange.value != "1")) &&
		((showWeekNumber == null) || (showWeekNumber.value != "1")))
	{
		if (printDetailsRow != null)
			printDetailsRow.style.display = 'none';

		if (printDetailsRowSpacer != null)
			printDetailsRowSpacer.style.display = 'none';
	}
	else if (((showLastChange != null) && (showLastChange.value == "1")) ||
		((showWeekNumber != null) && (showWeekNumber.value == "1")))
	{
		if (printDetailsRow != null)
               printDetailsRow.className = '';

		if (printDetailsRowSpacer != null)
			printDetailsRowSpacer.className = '';
	}

    checkWhatToPrint();
	fillPrintData();
}

window.onload = onLoad;
