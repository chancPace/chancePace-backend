import express from 'express';
import {
  addCoupon,
  getAllCoupon,
  getOneCoupon,
  getSearchCoupon,
  getUserAllCoupon,
  sendCoupon,
  updateCoupon,
  UserCouponIsUsed,
  sendNewCoupon,
} from '../controller/coupon.js';
const router = express.Router();

//ANCHOR - 쿠폰 생성
router.post('/add-coupon', addCoupon);
//ANCHOR - 쿠폰 수정 및 삭제
router.patch('/update-coupon', updateCoupon);
//ANCHOR - 쿠폰 전체 조회 / 관리자
router.get('/get-all-coupon', getAllCoupon);
//ANCHOR - 쿠폰 발급
router.post('/send-coupon', sendCoupon);
//ANCHOR - 신규회원 구폰 발급
router.post('/send-new-coupon', sendNewCoupon);
//ANCHOR - 쿠폰 검색 / 관리자
router.get('/get-search-coupon', getSearchCoupon);
//ANCHOR - 쿠폰 1개 조회 / 쿠폰 상세페이지
router.get('/get-one-coupon', getOneCoupon);
//ANCHOR - 유저가 가지고 있는 쿠폰 조회
router.get('/get-user-all-coupon', getUserAllCoupon);
//ANCHOR - 유저가 쿠폰을 사용
router.patch('/user-coupon-is-used', UserCouponIsUsed);

export default router;
