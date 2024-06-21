var cart;
$(document).ready(function () {
    var isAdmin = $("#isAdmin").val();
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    $("#cartItemCount").text(cart.length);
    var table = $('#newproductTable').DataTable({
        "bPaginate": true,
        "bLengthChange": false,
        "bInfo": isAdmin.toString() == "1" ? true : false,
        columns: [
            { data: 'name', className: 'text-center' },
            {
                data: 'description',
                render: function (data) {
                    var shortdesc = data.substring(0, 50) + " ...";
                    return '<span title="' + data + '">' + shortdesc + '</span>';
                }
            },
            {
                data: 'price', className: 'td-number', render: function (data) {
                    return '$' + parseFloat(data).toFixed(2);
                }
            },
            { data: 'stock', className: 'td-number', visible: isAdmin.toString() == "1" ? true : false },
            {
                data: null, className: 'td-actions td-right', sorting: false, render: function (data, type, row) {
                    var cartIcon;
                    if (checkIfIdExists(data.id)) {
                        cartIcon = '<button type="button" class="btn btn-just-icon cart-item-added"><i class="mdi mdi-check-circle cart-item-added"></i></button>'
                    } else {
                        cartIcon = '<button class="btn btn-just-icon add-to-cart"><i class="mdi mdi-cart-outline"></i></button>'
                    }
                    var button = isAdmin.toString() == "1" ? '<button type="button" rel="tooltip" class="btn btn-success btn-just-icon btn-sm edit-product"><i class="mdi mdi-pencil"></i></button> | <button type="button" rel="tooltip" class="btn btn-danger btn-just-icon btn-sm delete-product"><i class="mdi mdi-delete"></i></button>' : cartIcon;
                    return button;
                }
            }
        ]
    });

    
    function fetchProductData() {
		$(".loader").show();
        $.ajax({
            url: 'Product/GetProductsList',
            method: 'GET',
            success: function (data) {
				$(".loader").hide();
                table.clear().rows.add(data.data).draw();
                updateAddToCartButtons();
            },
            error: function (xhr, res, status) {
				$(".loader").hide();
                if (xhr.status == 401) {
                    window.location.href = xhr.responseJSON.redirectUrl;
                    return;
                }
            }
        });
    }

    // Add product form submit handler
    $('#productForm').submit(function (event) {
        event.preventDefault();


        var name = $('#productname').val();
        var description = $('#productdescription').val();
        var price = parseFloat($('#productprice').val());
        var stock = parseInt($('#productstock').val());
        if (name.length == 0 || name == undefined) {
            toastr.error("Please Enter Product Name");
            return;
        }
        if (description.length == 0 || description == undefined) {
            toastr.error("Please Enter Product Description");
            return;
        }
        if (price == 0 || price == undefined || isNaN(price)) {
            toastr.error("Please Enter Price");
            return;
        }
        if (stock == 0 || stock == undefined || isNaN(stock)) {
            toastr.error("Please Enter Stock");
            return;
        }


        var product = {
            Name: name,
            Description: description,
            Price: price,
            Stock: stock
        }

        $.ajax({
            url: '/Product/CreateNewProduct',
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(product),
            success: function (data) {
                if (data.isSuccess) {
                    $('#productname').val('');
                    $('#productdescription').val('');
                    $('#productprice').val('');
                    $('#productstock').val('');
                    $('#newproductModal').modal('hide');
                    toastr.success(data.message);
                    fetchProductData();
                } else {
                    alert(data.message);
                }
            },
            error: function (xhr, res, status) {
                if (xhr.status == 401) {
                    window.location.href = xhr.responseJSON.redirectUrl;
                    return;
                }
            }
        });

    });

    
    $('#productEditForm').submit(function (event) {
        event.preventDefault();

        // Validate form fields
        if (!this.checkValidity()) {
            event.stopPropagation();
            return;
        }

        var id = $("#editproductId").val();
        var name = $('#editproductName').val();
        var description = $('#editproductDescription').val();
        var price = parseFloat($('#editproductPrice').val());
        var stock = parseInt($('#editproductStock').val());

        if (name.length == 0 || name == undefined) {
            toastr.error("Please Enter Product Name");
            return;
        }
        if (description.length == 0 || description == undefined) {
            toastr.error("Please Enter Product Description");
            return;
        }
        if (price == 0 || price == undefined || isNaN(price)) {
            toastr.error("Please Enter Price");
            return;
        }
        if (stock == 0 || stock == undefined || isNaN(stock)) {
            toastr.error("Please Enter Stock");
            return;
        }
        var product = {
            Id: id,
            Name: name,
            Description: description,
            Price: price,
            Stock: stock
        }
$(".loader").show();
        $.ajax({
            url: '/Product/EditProduct', // Replace with your API URL
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(product),
            success: function (data) {
				$(".loader").hide();
                if (data.isSuccess) {
                    $('#editproductId').val('');
                    $('#editproductName').val('');
                    $('#editproductDescription').val('');
                    $('#editproductPrice').val('');
                    $('#editproductStock').val('');
                    $('#editProductModal').modal('hide');
                    toastr.success(data.message);
                    fetchProductData();
                }
                else {
                    alert(data.message);
                }
            },
            error: function (xhr, res, status) {
				$(".loader").hide();
                if (xhr.status == 401) {
                    window.location.href = xhr.responseJSON.redirectUrl;
                    return;
                }
            }
        });

    });

    function updateAddToCartButtons() {
        $('.add-to-cart').off('click').on('click', function () {
            var row = $(this).closest('tr');
            var data = table.row(row).data();
            var product = {
                name: data.name,
                description: data.description,
                price: data.price,
                quantity: 1,
                stock: data.stock,
                id: data.id
            };
            if (data.stock > 0) {
                addToCart(product);
            } else {
                toastr.error("Product is out of stock.", "Error");
            }

        });
        $('.edit-product').off('click').on('click', function () {
            var row = $(this).closest('tr');
            var data = table.row(row).data();
            $('#editproductId').val(data.id);
            $('#editproductName').val(data.name);
            $('#editproductDescription').val(data.description);
            $('#editproductPrice').val(data.price);
            $('#editproductStock').val(data.stock);
            $('#editProductModal').modal('show');
        });

        $('.delete-product').off('click').on('click', function () {
            if (confirm("Are you sure you want to delete this product!") == true) {
                var row = $(this).closest('tr');
                var data = table.row(row).data();

                var product = {
                    Id: data.id
                }
$(".loader").show();
                $.ajax({
                    url: '/Product/DeleteProduct',
                    method: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(product),
                    success: function (data) {
						$(".loader").hide();
                        if (data.isSuccess) {
                            toastr.success(data.message, "Success");
                            fetchProductData();
                        }
                        else {
                            alert(data.message, "Error");
                        }
                    },
                    error: function (xhr, res, status) {
						$(".loader").hide();
                        if (xhr.status == 401) {
                            window.location.href = xhr.responseJSON.redirectUrl;
                            return;
                        }
                    }
                });
            }

        });

        //$(".cart-item-added").click(function () {
        //    var row = $(this).closest('tr');
        //    var data = table.row(row).data();
        //    for (var i = 0; i < cart.length; i++) {
        //        if (cart[i].id === data.id) {
        //            cart.splice(i, 1);
        //            $("#cartItemCount").text(cart.length);
        //            break;
        //        }
        //    }
        //    fetchProductData();
        //});
    }

    function addToCart(product) {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        var found = false;

        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === product.id) {
                cart[i].quantity += 1;
                if (cart[i].quantity > product.stock) {
                    toastr.error("Maximum quantity of " + product.name + " has been added to your cart!", "Error");
                    return "";
                    break;
                }
                found = true;
                break;
            }
        }

        if (!found) {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        $("#cartItemCount").text(cart.length);
        toastr.succ(product.name + " has been added to your cart!", "Success");
        fetchProductData();
    }

    function checkIfIdExists(idToCheck) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === idToCheck) {
                return true;
            }
        }
        return false;
    }

    fetchProductData();
});
