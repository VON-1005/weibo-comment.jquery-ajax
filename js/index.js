$(function() {
    //监听内容的实时输入  事件委托
    $('body').delegate('.comment', 'propertychange input', function() {
        if ($(this).val().length > 0) {
            $('.send').prop('disabled', false)
        } else {
            $('.send').prop('disabled', true)

        }
    })

    // var number = $.getCookie("pageNumber") || 1
    var number = window.location.hash.substring(1) || 1

    getMsgPage()

    function getMsgPage() {
        // weibo.php?act=get_page_count	获取页数
        $('.page').html('')
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=get_page_count",
            success: function(msg) {
                // console.log(msg);
                var obj = eval("(" + msg + ")")
                for (var i = 0; i < obj.count; i++) {
                    var $a = $(`<a href="javascript:;">` + (i + 1) + `</a>`)
                    if (i === (number - 1)) {
                        $a.addClass('cur')
                    }
                    $('.page').append($a)
                }
            },
            error: function(xhr) {
                alert(xhr.status)
            }
        })
    }


    getMsgList(number)

    function getMsgList(number) {
        $('.messageList').html('')
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=get&page=" + number,
            success: function(msg) {
                var obj = eval("(" + msg + ")")
                $.each(obj, function(key, value) {
                    var $weibo = createEle(value)
                    $weibo.get(0).obj = value
                    $('.messageList').append($weibo)
                })
            },
            error: function(xhr) {
                alert(xhr.status)
            }
        })
    }

    //监听发布按钮的点击事件
    $('.send').click(function() {
        var $text = $('.comment').val()
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=add&content=" + $text,
            success: function(msg) {
                // Uncaught SyntaxError: Unexpected token e in JSON at position 1
                //说明远程服务器返回的不是标准的json字符串
                var obj = eval("(" + msg + ")")
                obj.content = $text
                var $weibo = createEle(obj)
                $weibo.get(0).obj = obj
                $('.messageList').prepend($weibo)
                    //清空内容
                $('.comment').val("")
                getMsgPage()
                if ($('.info').length > 6) {
                    $('.info:last-child').remove()
                }
            },
            error: function(xhr) {
                alert(xhr.status)
            }
        })


    })

    //监听点赞
    $('body').delegate('.infoTop', 'click', function() {
        $(this).text(parseInt($(this).text()) + 1)
        var obj = $(this).parents('.info').get(0).obj
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=acc&id=" + obj.id,
            success: function(msg) {

            },
            error: function(xhr) {

            }
        })
    })

    //监听踩
    $('body').delegate('.infoDown', 'click', function() {
        $(this).text(parseInt($(this).text()) + 1)
        var obj = $(this).parents('.info').get(0).obj
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=ref&id=" + obj.id,
            success: function(msg) {

            },
            error: function(xhr) {

            }
        })
    })

    //监听删除
    $('body').delegate('.delete', 'click', function() {
        $(this).parents('.info').remove()
        var obj = $(this).parents('.info').get(0).obj
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=del&id=" + obj.id,
            success: function(msg) {
                getMsgPage()
            },
            error: function(xhr) {

            }
        })
        getMsgList($('.cur').html())
    })

    //监听页码
    $('body').delegate('.page>a', 'click', function() {
        $(this).addClass('cur')
        $(this).siblings().removeClass('cur')

        getMsgList($(this).html())

        // $.addCookie("pageNumber", $(this).html())
        window.location.hash = $(this).html()
    })

    function createEle(obj) {
        var $weibo = $(`<div class="info">
        <p class="infoText">` + obj.content + `</p>
        <p class="infoOperation">
            <span class="infoTime">` + formatDate(obj.time) + `</span>
            <span class="infoHandle">
                <a href="javascript:;" class="infoTop">` + obj.acc + `</a>
                <a href="javascript:;" class="infoDown">` + obj.ref + `</a>
                <a href="javascript:;" class="delete">删除</a>
                
            </span>
        </p>
    </div>`)
        return $weibo
    }

    function formatDate(time) {
        var date = new Date(time * 1000)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var min = date.getMinutes()
        var arr = [year + '-',
            month + '-',
            day + ' ',
            hour + ':',
            min
        ]
        return arr.join('')
    }


})