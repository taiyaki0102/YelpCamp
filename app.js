//express呼び出し
const express = require('express');
const app = express();

//mongoose呼び出し+mongoDB接続(MongoDB起動しておかないと接続不可)
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => {
    console.log('MongoDBコネクションOK');
})
.catch(() => {
    console.log('MongoDBコネクションエラー');
    console.log(err);
})

//ejs宣言+パス整形
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const Campground = require('./models/campground');

app.use(express.urlencoded({extended: true})); //フォームのリクエストをパース(オブジェクトなども受け取れるように)

//メソッドオーバーライド
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})


app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {runValidators: true, new: true});
    console.log(campground);
    res.redirect(`/campgrounds/${ id }`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('ポート3000');
});
