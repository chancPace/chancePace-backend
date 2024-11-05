import { Op } from 'sequelize';
import db from '../models/index.js';
import crypto from 'crypto';
import exp from 'constants';

const { Coupon, User, UserCoupon } = db;

//ANCHOR - 쿠폰 생성
export const addCoupon = async (req, res) => {
  try {
    const { couponName, discountPrice } = req.body;

    const newCoupon = await Coupon.create({
      // 쿠폰 이름
      couponName,
      // 할인금액
      discountPrice,
      // 쿠폰 활성 상태
      isActive: true,
    });

    res.status(200).json({
      result: true,
      data: newCoupon,
      message: `${newCoupon.discountPrice.toLocaleString()}원 쿠폰이 생성되었습니다.`,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};

//ANCHOR - 쿠폰 수정 및 삭제
export const updateCoupon = async (req, res) => {
  try {
    const { couponId, couponName, discountPrice, isActive } = req.body;
    const findCoupon = await Coupon.findOne({
      where: { id: couponId },
    });
    if (!findCoupon) {
      return res.status(404).json({
        result: false,
        message: '존재하지 않는 쿠폰입니다.',
      });
    }
    const updatedData = { couponName, discountPrice, isActive };
    // 값이 없다면 키를 삭제 시킴
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined || updatedData[key] === null || updatedData[key] === '') {
        delete updatedData[key];
      }
    });
    await Coupon.update(updatedData, { where: { id: couponId } });
    res.status(200).json({
      result: true,
      message: updatedData.isActive
        ? `"${findCoupon.couponName}" 쿠폰을 수정하는데 성공했습니다.`
        : `"${findCoupon.couponName}" 쿠폰을 삭제하는데 성공했습니다.`,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};

//ANCHOR - 쿠폰 전체 조회 / 관리자
export const getAllCoupon = async (req, res) => {
  try {
    const allCoupons = await Coupon.findAll();
    if (!allCoupons) {
      return res.status(404).json({
        result: false,
        message: '등록된 쿠폰이 없습니다.',
      });
    }
    res.status(200).json({
      result: true,
      data: allCoupons,
      message: '전체 쿠폰을 조회하는데 성공했습니다.',
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};

//ANCHOR - 쿠폰 발급
export const sendCoupon = async (req, res) => {
  try {
    const { expirationDate, userId, couponId } = req.body;
    const findUser = await User.findOne({ where: { id: userId } });
    if (!findUser) {
      return res.status(404).json({
        result: false,
        message: '존재하지 않는 유저입니다.',
      });
    }
    const findCoupon = await Coupon.findOne({ where: { id: couponId } });
    if (!findCoupon) {
      return res.status(404).json({
        result: false,
        message: '존재하지 않는 쿠폰입니다.',
      });
    }
    // crypto를 사용하여 쿠폰 코드 생성
    const newCouponCode = `COUPON_${Date.now().toString()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const addUserCoupon = await UserCoupon.create({
      // 쿠폰 코드
      couponCode: newCouponCode,
      // 유효 기간
      expirationDate: new Date(expirationDate),
      // 사용 여부
      isUsed: false,
      // 발급 받을 유저
      userId,
      // 발급 할 쿠폰
      couponId,
    });
    res.status(200).json({
      result: true,
      data: addUserCoupon,
      message: `${findUser.userName}님에게 ${findCoupon.couponName}을 발급하였습니다.`,
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};
3;
//ANCHOR - 쿠폰 검색 기능
export const getSearchCoupon = async (req, res) => {
  try {
    const { query } = req.query;
    const coupons = await Coupon.findAll({
      where: {
        [Op.or]: [{ couponName: { [Op.like]: `%${query}%` } }, { discountPrice: { [Op.like]: `%${query}%` } }],
      },
      include: [{ model: User }],
    });
    res.status(200).json({
      result: true,
      data: coupons,
      message: `"${query}"의 검색 결과입니다.`,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};

//ANCHOR - 쿠폰 상세페이지
export const getOneCoupon = async (req, res) => {
  try {
    const { couponId } = req.query;
    const findCoupon = await Coupon.findOne({
      where: { id: couponId },
    });
    if (!findCoupon) {
      return res.status(404).json({
        result: false,
        message: '존재하지 않는 쿠폰입니다.',
      });
    }
    res.status(200).json({
      result: true,
      data: findCoupon,
      message: '쿠폰 조회에 성공했습니다.',
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};

//ANCHOR - 유저가 가지고 있는 쿠폰 조회
export const getUserAllCoupon = async (req, res) => {
  try {
    const { userId } = req.query;
    const findCoupons = await UserCoupon.findAll({
      where: { userId },
      include: [
        {
          model: Coupon,
        },
      ],
    });
    if (!findCoupons) {
      return res.status(404).json({
        result: false,
        message: '존재하지 않는 쿠폰입니다.',
      });
    }
    res.status(200).json({
      result: true,
      data: findCoupons,
      message: '쿠폰 조회에 성공했습니다.',
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};

//ANCHOR - 유저가 쿠폰 사용시 isUsed 값 변경
export const UserCouponIsUsed = async (req, res) => {
  try {
    const { userCouponId } = req.body;
    const findUserCoupon = await UserCoupon.findOne({
      where: { id: userCouponId, isUsed: false },
      include: [{ model: Coupon }],
    });
    if (!findUserCoupon) {
      return res.status(404).json({
        result: false,
        message: '해당 쿠폰이 존재하지 않거나 이미 사용되었습니다.',
      });
    }
    await UserCoupon.update(
      { isUsed: true },
      {
        where: { id: userCouponId },
      }
    );
    res.status(200).json({
      result: true,
      message: `"${findUserCoupon.Coupon.couponName}" 쿠폰을 사용했습니다`,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버 에러',
      error: error.message,
    });
  }
};
