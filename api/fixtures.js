const mongoose = require('mongoose');
const {nanoid} = require('nanoid');
const config = require('./config');

const User = require('./models/User');
const Message = require("./models/Message");


const run = async () => {
    await mongoose.connect(config.mongo.db);

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const coll of collections) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const [spaceRoomUser, alekseiPopovUser, lidiaNiderreychUser, megazaic39User, evgeniyLitvinenkoUser, vladimirAlexandrovichUser, sashaGribUser] = await User.create({
        username: 'Space Room',
        password: 'SpaceRoom',
        role: 'moderator',
        token: nanoid(),
    }, {
        username: 'Aleksei Popov',
        password: 'AlekseiPopov',
        role: 'user',
        token: nanoid(),
    }, {
        username: 'Lidia Niderreych',
        password: 'LidiaNiderreych',
        role: 'user',
        token: nanoid(),
    }, {
        username: 'Megazaic39 [E16]',
        password: 'Megazaic39',
        role: 'user',
        token: nanoid(),
    }, {
        username: 'Евгений Литвиненко',
        password: 'EvgeniyLitvinenko',
        role: 'user',
        token: nanoid(),
    }, {
        username: 'Vladimir Alexandrovich',
        password: 'VladimirAlexandrovich',
        role: 'user',
        token: nanoid(),
    }, {
        username: 'Саша Гриб',
        password: 'SashaGrib',
        role: 'user',
        token: nanoid(),
    }, {
        username: 'Евгений Литвиненко',
        password: 'EvgeniyLitvinenko',
        role: 'user',
        token: nanoid(),
    });

    await Message.create({
        user: spaceRoomUser._id,
        message: 'Космический аппарат NASA столкнулся со 160-метровым астероидом! Столкновение производилось «лоб в лоб» на скорости 22,5 тысячи километров в час, поэтому, даже несмотря на значительную разницу в массе – 550 килограмм против расчетных 3 миллионов тонн – удар был заметный. Считается, что даже незначительное воздействие на потенциально опасный объект на дистанции в миллионы километров от Земли дает большое изменение его траектории, что в будущем может позволить обезопасить нашу планету от возможной катастрофы.',
        date: '2022-10-13T06:13:08.000Z'
    }, {
        user: alekseiPopovUser._id,
        message: 'Кого признали виноватым в ДТП? Точнее в КТП.',
        date: '2022-10-13T07:23:21.000Z'
    }, {
        user: lidiaNiderreychUser._id,
        message: 'Астероид. Он виноват во всем и был наказан',
        date: '2022-10-13T09:53:17.000Z'
    }, {
        user: alekseiPopovUser._id,
        message: 'в чём виноват? 😳 Летали парочкой, никого не трогали и тут люди такие "а ну-ка, подвинься!" 🚀‍',
        date: '2022-10-13T11:03:00.000Z',
        recipient: lidiaNiderreychUser._id
    }, {
        user: megazaic39User._id,
        message: 'вообще-то это был краш-тест 🤷‍',
        date: '2022-10-13T11:03:00.000Z'
    }, {
        user: sashaGribUser._id,
        message: 'И что показал краш-тест? Подушки безопасности космонавту помогут?',
        date: '2022-10-13T11:03:00.000Z',
        recipient: megazaic39User._id
    }, {
        user: evgeniyLitvinenkoUser._id,
        message: 'Если судить по расчётным 3 млн тонн для астероида и 550 кг для аппарата, то это как для 70 кг человека удар небольшой мухи (~12 мг).',
        date: '2022-10-13T13:41:21.000Z'
    }, {
        user: vladimirAlexandrovichUser._id,
        message: '.... удар небольшой мухи в невесомости с последующим многолетним наблюдением отклонения движения.',
        date: '2022-10-13T16:32:08.000Z'
    }, {
        user: sashaGribUser._id,
        message: 'И не надо отправлять ракету с камикадзе-космонавтами)',
        date: '2022-10-13T18:12:51.000Z'
    }, {
        user: vladimirAlexandrovichUser._id,
        message: 'Если оно переместит четыре млн. тонн на >12800 км то в пересчёте на расценки грузоперевозок получится суперэффективно',
        date: '2022-10-13T18:33:18.000Z'
    }, {
        user: megazaic39User._id,
        message: 'В результате этого удара через тысячи лет траектории астероида и Земли пересекутся',
        date: '2022-10-13T18:48:07.000Z'
    });

    await mongoose.connection.close();
};

run().catch(console.error);