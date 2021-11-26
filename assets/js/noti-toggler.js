var expanded=false;
const noti=document.querySelector('.notify');
noti.addEventListener('click', function(e) {
    if(!expanded)
    {
        $('#notifications').css('display','block');
        expanded=true;
    }
    else
    {
        $('#notifications').css('display','none');
        expanded=false;
    }

})