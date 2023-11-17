const product = [
    {
        id: 1,
        image: 'aj2.jpg',
        title: 'Euro$tep Air Jordan 1 : Panda Edition',
        price: 758,
    },

    {
        id: 2,
        image: 'airmax97.jpg',
        title: 'Euro$tep Airmax 97: Highlight Edition',
        price: 489,
    },

    {
        id: 3,
        image: 'airforce1.jpg',
        title: 'Euro$tep Air Force: Candy Blue Edition',
        price: 578,
    },

    {
        id: 4,
        image: 'airjax.jpg',
        title: 'Euro$tep Air Jax: Black-White Edition',
        price: 399,
    },

    {
        id: 5,
        image: 'fasto.jpg',
        title: 'Euro$tep Predator: Demon Slayer Edition',
        price: 819,
    },

    {
        id: 6,
        image: 'pegasus.jpg',
        title: 'Euro$tep Pegasus: Green Day Edition',
        price: 627,
    },

    {
        id: 7,
        image: 'airforce-shadow.jpg',
        title: 'Euro$tep Air Force: Shadow',
        price: 469,
    },

    {
        id: 8,
        image: 'jordan.jpg',
        title: 'Euro$tep Jordan: Fade Away',
        price: 349,
    },

    {
        id: 9,
        image: 'airflight.jpg',
        title: 'Euro$tep Air Flight: Huracan',
        price: 599,
    },

    {
        id: 10,
        image: 'phantomluna.jpg',
        title: 'Euro$tep Phantom Luna: Red',
        price: 539,
    },

    {
        id: 11,
        image: 'superfly.jpg',
        title: 'Euro$tep Mercurial Superfly 9: Blue Flame',
        price: 399,
    },

    {
        id: 12,
        image: 'evil.jpg',
        title: 'Euro$tep Gripknit Phantom GX Elite Dynamic Fit: Evil',
        price: 1509,
    }
]

const categories = [...new Set(product.map((item)=>
    {return item}))]
    let i=0;
document.getElementById('root').innerHTML = categories.map((item)=>
{
    var {image, title, price} = item;
    return(
        `<div class='box'>
            <div class='img-box'>
                <img class='images' src=${image}></img>
            </div>
        <div class='bottom'>
        <p>${title}</p>
        <h4>$ ${price}.00</h4>`+
        "<button onclick='addtocart("+(i++)+")'>Add to cart</button>"+
        `</div>
        </div>`
    )
}).join('')

var cart =[];

function addtocart(a){
    cart.push({...categories[a]});
    displaycart();
}
function delElement(a){
    cart.splice(a, 1);
    displaycart();
}

function displaycart(){
    let j = 0, total=0;
    document.getElementById("count").innerHTML=cart.length;
    if(cart.length==0){
        document.getElementById('cartItem').innerHTML = "Your cart is empty";
        document.getElementById("total").innerHTML = "$ "+0+".00";
    }
    else{
        document.getElementById("cartItem").innerHTML = cart.map((items)=>
        {
            var {image, title, price} = items;
            total=total+price;
            document.getElementById("total").innerHTML = "$ "+total+".00";
            return(
                `<div class='cart-item'>
                <div class='row-img'>
                    <img class='rowimg' src=${image}>
                </div>
                <p style='font-size:18px;'>${title}</p>
                <h4 style='font-size: 15px;'>$ ${price}.00</h4>`+
                "<i class='fa-solid fa-trash' onclick='delElement("+ (j++) +")'></i></div>"
            );
        }).join('');
    }

    
}