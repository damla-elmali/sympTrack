from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# Kullanıcı tablosu
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # İlişki: Kullanıcının semptom kayıtları
    symptoms = relationship("Symptom", back_populates="owner")


# Semptom tablosu
class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    severity = Column(Integer)  # 1-10 arası şiddet seviyesi
    created_at = Column(DateTime, default=datetime.utcnow)

    # İlişki
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="symptoms")
