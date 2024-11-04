import Sequelize from 'sequelize';
import configFile from '../config/config.js';

import UserModel from './user.js';
import CategoryModel from './category.js';
import SpaceModel from './space.js';
import ReviewModel from './review.js';
import PaymentModel from './payment.js';
import BookingModel from './booking.js';
import CouponModel from './coupon.js';
import TagModel from './tag.js';
import ImageModel from './image.js';
import UserCouponModel from './userCoupon.js';

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 유저 모델
db.User = UserModel(sequelize);
// 카테고리 모델
db.Category = CategoryModel(sequelize);
// 공간 모델
db.Space = SpaceModel(sequelize);
// 리뷰 모델 (Space와 User를 참조)
db.Review = ReviewModel(sequelize);
// 결제 모델 (User를 참조)
db.Payment = PaymentModel(sequelize);
// 예약 모델 (Space와 User를 참조)
db.Booking = BookingModel(sequelize);
// 태그 모델
db.Tag = TagModel(sequelize);
// 쿠폰 모델
db.Coupon = CouponModel(sequelize);
// 이미지 모델
db.Image = ImageModel(sequelize);
// UserCoupon 중간 테이블 모델 추가
db.UserCoupon = UserCouponModel(sequelize);

// 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
