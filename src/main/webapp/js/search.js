var curPage = 1;
var recPerPage = 10;
var paginationBar;
$(document).ready(function () {
    loadTableData();
    pagination();

    $('#txtSearch').keyup(function () {
        autoFillSearch();
    });
    $('#txtSearch').keydown(function () {
        autoFillSearch();
    });

    $('#btnRefresh').click(function () {
        refresh();
    });

    $('#btnSearch').click(function () {
        search();
    });
});

function loadTableData() {
    $.ajax({
        type: "POST",
        url: "load",
        dataType: "json",
        data: {"page": "1", "recordsCount": recPerPage},
        success: function (result) {
            $('#table').bootstrapTable({
                pageSize: recPerPage,
                showColumns: true,
                singleSelect: true,
                minimumCountColumns: 3,
                columns: [{
                    field: 'firstname',
                    title: 'First name',
                    sortable: true
                }, {
                    field: 'lastname',
                    title: 'Last name',
                    sortable: true
                }, {
                    field: 'country',
                    title: 'Country',
                    sortable: true
                }, {
                    field: 'city',
                    title: 'City',
                    sortable: true
                }, {
                    field: 'dob',
                    title: 'DOB',
                    sortable: true
                }, {
                    field: 'username',
                    title: 'User name',
                    sortable: true
                }, {
                    field: 'email',
                    title: 'Email'
                }, {
                    field: 'tel',
                    title: 'Contact no'
                }, {
                    field: 'operations',
                    title: 'Operations',
                    formatter: operateFormatter,
                    events: operateEvents
                }],
                data: result
            });
        }
    });
}

function operateFormatter(value, row, index) {
    return [
        '<center>',
        '<a class="edit" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-edit"></i>Edit',
        '</a>&nbsp;&nbsp;',
        '<a class="delete" href="javascript:void(0)" title="Delete">',
        '<i class="glyphicon glyphicon-remove"></i>Delete',
        '</a></center>'
    ].join('');
}

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        var js = JSON.stringify(row);
        var obj = JSON.parse(js);
        var userId = obj["id"];
        $('#ufname').val(obj["firstname"]);
        $('#ulname').val(obj["lastname"]);
        $('#ucountrySelect').val(obj["country"]);
        $('#ucitySelect').val(obj["city"]);
        $('#udate').val(obj["dob"]);
        $('#uusername').val(obj["username"]);
        $('#uemail').val(obj["email"]);
        $('#utel').val(obj["tel"]);
        $('#updateUserPopup').modal('show');
        loadCities2();
        loadGroups2();
        loadUserCity();

        $('#updateOk').off('click');
        $('#updateOk').click(function () {
            if (validateFirstName2() == false || validateLastName2() == false || validateDOB2() == false || validateGroup2() == false || validateEmail2() == false || validateTelNo2() == false) {
                $('#updateUserFail').modal('show');
            } else {
                var selectednumbers = [];
                $('#ugroupSelect :selected').each(function (i, selected) {
                    selectednumbers[i] = $(selected).val();
                });
                $.ajax({
                    type: "POST",
                    url: "update",
                    data: {
                        "id": userId,
                        "ufname": $('#ufname').val(),
                        "ulname": $('#ulname').val(),
                        "ucountry": $('#ucountrySelect').val(),
                        "ucity": $('#ucitySelect').val(),
                        "ugroup[]": selectednumbers,
                        "udate": $('#udate').val(),
                        "uemail": $('#uemail').val(),
                        "utel": $('#utel').val()
                    },
                    success: function (result) {
                        if ($.trim(result) == 1) {
                            $('#updateUserPopup').modal('hide');
                            $('#updateUserSuccess').modal('show');
                            $('#update').trigger('reset');
                            refresh(curPage);
                        } else {
                            $('#updateUserFail').modal('show');
                        }
                    }
                });
            }
        });
    },
    'click .delete': function (e, value, row, index) {
        var js = JSON.stringify(row);
        var obj = JSON.parse(js);
        var userId = obj["id"];
        $('#lbFname').text("First name: " + obj["firstname"]);
        $('#lbLname').text("Last name: " + obj["lastname"]);
        $('#lbCountry').text("Country: " + obj["country"]);
        $('#lbCity').text("City: " + obj["city"]);
        $('#lbDob').text("Date of birth: " + obj["dob"]);
        $('#lbUsrname').text("User name: " + obj["username"]);
        $('#lbEmail').text("Email: " + obj["email"]);
        $('#lbTel').text("Contact no: " + obj["tel"]);
        $('#deleteUserPopup').modal('show');

        $('#deleteOk').off('click');
        $('#deleteOk').click(function () {
            $.ajax({
                type: "POST",
                url: "delete",
                data: {"id": userId},
                success: function (result) {
                    if ($.trim(result) == 1) {
                        $('#deleteUserPopup').modal('hide');
                        $('#deleteUserSuccess').modal('show');
                        refresh(curPage);
                    } else {
                        $('#deleteUserPopup').modal('hide');
                        $('#deleteUserFail').modal('show');
                    }
                }
            });
        });
    }
};

function autoFillSearch() {
    var searchName = $('#txtSearch').val();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "typeahead",
        // To send data we can use following format as well.
        // data: "searchUsername="+searchUsername+"&typeahead="+"1",
        data: {"searchName": searchName},
        success: function (result) {
            $('#txtSearch').typeahead({
                name: 'txtSearch',
                limit: 10,
                minLength: 1,
                source: result
            }).focus();
        }
    });
}

function search() {
    var searchName = $('#txtSearch').val();
    if (searchName.length == 0) {
        $('#pagination2').hide();
        $('#pagination').show();
        $('#comboPages').show();
        $('#comboRecCount').show();
        $('.pagiTexts').show();

        $.ajax({
            type: "POST",
            url: "load",
            dataType: "json",
            data: {"page": "1", "recordsCount": recPerPage},
            success: function (result) {
                $('#table').bootstrapTable('load', result);
                paginationBar.simplePaginator('changePage', 1);
            }
        });
    } else {
        $('#pagination').hide();
        $('#pagination2').show();
        $('#comboPages').hide();
        $('#comboRecCount').hide();
        $('.pagiTexts').hide();

        $.ajax({
            type: "POST",
            url: "search",
            dataType: "json",
            data: {"searchName": searchName, "offset": "1"},
            success: function (result) {
                $('#table').bootstrapTable('load', result);
            }
        });

        $.ajax({
            type: "post",
            url: "searchpagination",
            data: {"searchName": searchName},
            success: function (result) {
                var pageCount = Math.ceil(result / recPerPage);
                paginationBar2.simplePaginator('setTotalPages', pageCount);
            }
        });

        paginationBar2 = $('#pagination2').simplePaginator({
            totalPages: 1,
            maxButtonsVisible: 5,
            currentPage: 1,
            nextLabel: 'Next',
            prevLabel: 'Prev',
            firstLabel: 'First',
            lastLabel: 'Last',

            pageChange: function (page) {
                $.ajax({
                    type: "post",
                    url: "search",
                    dataType: "json",
                    data: {"searchName": searchName, "offset": page},
                    success: function (result) {
                        $('#table').bootstrapTable('load', result);
                    }
                });
            }
        });
    }
}

function refresh(currentPage) {
    currentPage = curPage;
    $.ajax({
        type: "POST",
        url: "load",
        dataType: "json",
        data: {"page": currentPage, "recordsCount": recPerPage},
        success: function (result) {
            $('#table').bootstrapTable('load', result);
        }
    });
}

function loadPageSelect(pages) {
    var select = $("#comboPages"), options = '';
    select.empty();
    for (var i = 1; i <= pages; i++) {
        options += "<option>" + i + "</option>";
    }
    select.append(options);
}

$('#comboPages').change(function () {
    var selectedPage = $('#comboPages').val();
    $.ajax({
        type: "post",
        url: "load",
        dataType: "json",
        data: {"page": selectedPage, "recordsCount": recPerPage},
        success: function (result) {
            $('#table').bootstrapTable('load', result);
            $('#comboPages').val(selectedPage);
            $('#pagination').simplePaginator('change', selectedPage);
        }
    });
});

$('#comboRecCount').change(function () {
    recPerPage = $('#comboRecCount').val();
    $.ajax({
        type: "POST",
        url: "load",
        dataType: "json",
        data: {"page": "1", "recordsCount": recPerPage},
        success: function (result) {
            $('#table').bootstrapTable('load', result);
            paginationBar.simplePaginator('changePage', 1);
        }
    });

    $.ajax({
        type: "get",
        url: "pagination",
        success: function (result) {
            var totalPages=Math.ceil(result / recPerPage);
            paginationBar.simplePaginator('setTotalPages', totalPages);
            loadPageSelect(totalPages);
        }
    });
});

function pagination() {
    paginationBar = $('#pagination').simplePaginator({
        totalPages: 1,
        maxButtonsVisible: 5,
        currentPage: 1,
        nextLabel: 'Next',
        prevLabel: 'Prev',
        firstLabel: 'First',
        lastLabel: 'Last',

        pageChange: function (page) {
            curPage = page;
            $.ajax({
                type: "post",
                url: "load",
                dataType: "json",
                data: {"page": page, "recordsCount": recPerPage},
                success: function (result) {
                    $('#table').bootstrapTable('load', result);
                    $('#comboPages').val(page);
                }
            });
        }
    });

    $.ajax({
        type: "get",
        url: "pagination",
        success: function (result) {
            var pageCount = Math.ceil(result / recPerPage);
            paginationBar.simplePaginator('setTotalPages', pageCount);
            loadPageSelect(pageCount);
        }
    });
}